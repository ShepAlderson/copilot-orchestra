# Local RAG System using LlamaIndex

A ready-to-use Dockerized Retrieval-Augmented Generation (RAG) system powered by LlamaIndex for the GitHub Copilot Orchestra.

## Overview

This RAG system enables intelligent querying of project documentation, code context retrieval, and informed recommendations for all agents in the Orchestra system.

## Architecture

The system consists of:
- **FastAPI Backend**: REST API for document ingestion and querying
- **LlamaIndex**: Vector store and RAG engine
- **Ollama**: Local LLM inference (mistral model)
- **Qdrant**: Vector database for embeddings
- **Docker Compose**: Orchestration of all services

## Prerequisites

- Docker and Docker Compose installed
- At least 8GB RAM available
- 10GB disk space for models and data

## Quick Start

### 1. Start the RAG System

```bash
cd .roo/local-rag-llamaindex
docker-compose up -d
```

This will start:
- FastAPI server on `http://localhost:8000`
- Qdrant on `http://localhost:6333`
- Ollama service with mistral model

### 2. Verify Services

```bash
# Check all services are running
docker-compose ps

# Check API health
curl http://localhost:8000/health
```

### 3. Index Your Documentation

```bash
# Index the entire repository documentation
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"path": "/workspace"}'
```

### 4. Query the System

```bash
# Ask questions about your codebase
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How does the Conductor agent orchestrate subagents?"}'
```

## API Endpoints

### POST /ingest
Index documents from a directory.

**Request:**
```json
{
  "path": "/workspace/docs",
  "file_types": [".md", ".txt", ".py"]
}
```

### POST /query
Query the indexed documents.

**Request:**
```json
{
  "question": "What is the implementation workflow?",
  "top_k": 3
}
```

**Response:**
```json
{
  "answer": "The implementation workflow follows TDD...",
  "sources": [
    {"file": "ARCHITECTURE.md", "chunk": "..."},
    {"file": "README.md", "chunk": "..."}
  ]
}
```

### GET /health
Check system health and readiness.

## Configuration

### Environment Variables

Create a `.env` file to customize:

```env
# LLM Configuration
OLLAMA_MODEL=mistral
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Vector Store
QDRANT_HOST=qdrant
QDRANT_PORT=6333

# API Configuration
API_PORT=8000
```

### Indexing Options

Modify `config.yaml` to control:
- File types to index
- Chunk size and overlap
- Embedding model
- Retrieval settings

## Usage with Orchestra Agents

Agents can query the RAG system to:

### Planning Subagent
```python
# Get architectural context
response = requests.post('http://localhost:8000/query', json={
    'question': 'What are the existing API patterns in this codebase?'
})
```

### Implementation Subagent
```python
# Get implementation examples
response = requests.post('http://localhost:8000/query', json={
    'question': 'Show me examples of TDD implementation in this project'
})
```

### Code Review Subagent
```python
# Get coding standards
response = requests.post('http://localhost:8000/query', json={
    'question': 'What are the code quality standards for this project?'
})
```

## Managing the System

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

### Restart Services
```bash
docker-compose restart
```

### Stop Services
```bash
docker-compose down
```

### Reset Vector Store
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d
```

## Performance Tuning

### For Limited Resources
- Use smaller embedding model: `all-MiniLM-L6-v2`
- Reduce chunk size in `config.yaml`
- Limit concurrent requests

### For Better Accuracy
- Use larger model: `mixtral` or `llama2:13b`
- Increase chunk overlap
- Adjust top_k retrieval parameter

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Ensure ports are available
lsof -i :8000
lsof -i :6333
```

### Slow responses
- Check Ollama model is downloaded
- Increase Docker memory allocation
- Use smaller model if necessary

### Poor retrieval quality
- Re-index with better chunking strategy
- Adjust similarity threshold
- Use more specific queries

## Architecture Diagram

```
┌─────────────────┐
│  Orchestra      │
│  Agents         │
└────────┬────────┘
         │ Query
         ▼
┌─────────────────┐
│  FastAPI        │◄──── REST API
│  Backend        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│LlamaIndex│ │ Qdrant  │
│  Engine  │ │ Vector  │
└────┬────┘ │   DB    │
     │      └─────────┘
     ▼
┌─────────┐
│ Ollama  │
│  LLM    │
└─────────┘
```

## References

- [Original Blog Post](https://otmaneboughaba.com/posts/dockerize-rag-application/)
- [LlamaIndex Documentation](https://docs.llamaindex.ai/)
- [Ollama Models](https://ollama.ai/library)
- [Qdrant Documentation](https://qdrant.tech/documentation/)

## Contributing

To improve the RAG system:
1. Test with different models in `docker-compose.yml`
2. Adjust chunking strategy in `app/config.py`
3. Add new endpoints in `app/main.py`
4. Update documentation with findings

## License

Same as parent project (MIT License)
