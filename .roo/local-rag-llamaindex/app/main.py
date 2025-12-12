"""
FastAPI RAG Application using LlamaIndex
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from pathlib import Path

from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    Settings,
)
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

# Initialize FastAPI app
app = FastAPI(
    title="Copilot Orchestra RAG API",
    description="Retrieval-Augmented Generation system for the GitHub Copilot Orchestra",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration from environment variables
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "ollama")
OLLAMA_PORT = os.getenv("OLLAMA_PORT", "11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")
QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
COLLECTION_NAME = "copilot_orchestra_docs"

# Global index variable
index = None


class IngestRequest(BaseModel):
    """Request model for document ingestion"""
    path: str
    file_types: Optional[List[str]] = [".md", ".txt", ".py", ".js", ".ts", ".java", ".go", ".rs"]


class QueryRequest(BaseModel):
    """Request model for querying"""
    question: str
    top_k: Optional[int] = 3


class QueryResponse(BaseModel):
    """Response model for queries"""
    answer: str
    sources: List[dict]


@app.on_event("startup")
async def startup_event():
    """Initialize LlamaIndex components on startup"""
    global index
    
    # Configure LLM
    llm = Ollama(
        model=OLLAMA_MODEL,
        base_url=f"http://{OLLAMA_HOST}:{OLLAMA_PORT}",
        request_timeout=120.0,
    )
    
    # Configure embedding model
    embed_model = HuggingFaceEmbedding(
        model_name=EMBEDDING_MODEL
    )
    
    # Set global settings
    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.chunk_size = 512
    Settings.chunk_overlap = 50
    
    # Initialize Qdrant client
    client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
    
    # Create vector store
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=COLLECTION_NAME,
    )
    
    # Create storage context
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    try:
        # Try to load existing index
        index = VectorStoreIndex.from_vector_store(
            vector_store=vector_store,
            storage_context=storage_context,
        )
        print("✓ Loaded existing index from Qdrant")
    except Exception as e:
        print(f"⚠ No existing index found: {e}")
        print("→ Will create index on first ingestion")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Copilot Orchestra RAG API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "ingest": "/ingest",
            "query": "/query",
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "ollama": f"{OLLAMA_HOST}:{OLLAMA_PORT}",
        "qdrant": f"{QDRANT_HOST}:{QDRANT_PORT}",
        "model": OLLAMA_MODEL,
        "index_ready": index is not None,
    }


@app.post("/ingest")
async def ingest_documents(request: IngestRequest):
    """
    Ingest documents from a directory into the vector store
    """
    global index
    
    path = Path(request.path)
    
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Path not found: {request.path}")
    
    try:
        # Read documents
        print(f"→ Reading documents from {path}")
        reader = SimpleDirectoryReader(
            input_dir=str(path),
            required_exts=request.file_types,
            recursive=True,
        )
        documents = reader.load_data()
        
        if not documents:
            raise HTTPException(status_code=400, detail="No documents found")
        
        print(f"✓ Loaded {len(documents)} documents")
        
        # Initialize Qdrant client
        client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
        
        # Create vector store
        vector_store = QdrantVectorStore(
            client=client,
            collection_name=COLLECTION_NAME,
        )
        
        # Create storage context
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        
        # Create or update index
        print("→ Creating index...")
        index = VectorStoreIndex.from_documents(
            documents,
            storage_context=storage_context,
        )
        print("✓ Index created successfully")
        
        return {
            "status": "success",
            "documents_indexed": len(documents),
            "path": str(path),
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Query the indexed documents
    """
    global index
    
    if index is None:
        raise HTTPException(
            status_code=400,
            detail="No documents indexed yet. Please ingest documents first."
        )
    
    try:
        # Create query engine
        query_engine = index.as_query_engine(
            similarity_top_k=request.top_k,
            response_mode="tree_summarize",
        )
        
        # Execute query
        print(f"→ Querying: {request.question}")
        response = query_engine.query(request.question)
        
        # Extract sources
        sources = []
        if hasattr(response, 'source_nodes'):
            for node in response.source_nodes:
                sources.append({
                    "file": node.metadata.get("file_path", "unknown"),
                    "score": node.score if hasattr(node, 'score') else None,
                    "chunk": node.text[:200] + "..." if len(node.text) > 200 else node.text,
                })
        
        return QueryResponse(
            answer=str(response),
            sources=sources,
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.delete("/index")
async def clear_index():
    """
    Clear the current index
    """
    global index
    
    try:
        # Initialize Qdrant client
        client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
        
        # Delete collection
        client.delete_collection(collection_name=COLLECTION_NAME)
        
        index = None
        
        return {
            "status": "success",
            "message": "Index cleared successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clear failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
