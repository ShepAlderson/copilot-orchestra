#!/bin/bash
set -e

echo "🚀 Starting Copilot Orchestra RAG System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker and try again"
    exit 1
fi

echo "✓ Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose is not installed"
    echo "Please install docker-compose and try again"
    exit 1
fi

echo "✓ docker-compose is available"
echo ""

# Start services
echo "→ Starting services (this may take a few minutes on first run)..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check health
echo ""
echo "→ Checking API health..."
max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ API is ready!"
        break
    fi
    retry_count=$((retry_count + 1))
    echo "  Waiting... ($retry_count/$max_retries)"
    sleep 2
done

if [ $retry_count -eq $max_retries ]; then
    echo "❌ API did not start in time"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo "✅ RAG System is ready!"
echo ""
echo "📚 Access points:"
echo "  - API:    http://localhost:8000"
echo "  - Docs:   http://localhost:8000/docs"
echo "  - Qdrant: http://localhost:6333/dashboard"
echo ""
echo "🔧 Quick commands:"
echo "  - Index docs:   curl -X POST http://localhost:8000/ingest -H 'Content-Type: application/json' -d '{\"path\": \"/workspace\"}'"
echo "  - Query:        curl -X POST http://localhost:8000/query -H 'Content-Type: application/json' -d '{\"question\": \"How does the Conductor work?\"}'"
echo "  - View logs:    docker-compose logs -f"
echo "  - Stop system:  docker-compose down"
echo ""
