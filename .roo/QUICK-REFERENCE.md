# Quick Reference: .roo Configuration System

## Directory Structure

```
.roo/
├── rules-Conductor/              # Orchestration modes
├── rules-planning-subagent/      # Research modes
├── rules-implement-subagent/     # Implementation modes
├── rules-code-review-subagent/   # Review modes
├── rules-quality-assurance-subagent/  # QA modes
└── local-rag-llamaindex/         # RAG system
```

## Available Modes

### Conductor
- `strict-mode` - Extra validation, 90% coverage, comprehensive security
- `rapid-mode` - Fast iterations, 60% coverage, prototyping

### Planning Subagent
- `deep-research-mode` - Comprehensive analysis and file reading

### Implementation Subagent
- `strict-tdd-mode` - Rigorous test-first discipline

### Code Review Subagent
- `security-focused-mode` - Security vulnerability emphasis

## RAG System Quick Start

### 1. Start the system
```bash
cd .roo/local-rag-llamaindex
./start.sh
```

### 2. Index your documentation
```bash
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"path": "/workspace"}'
```

### 3. Query the system
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How does the Conductor work?"}'
```

## RAG API Endpoints

- `GET /health` - Check system health
- `POST /ingest` - Index documents from a directory
- `POST /query` - Ask questions about indexed content
- `DELETE /index` - Clear the current index

## Services

- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Qdrant Dashboard**: http://localhost:6333/dashboard

## Mode Configuration Usage

### Environment Variable
```bash
export CONDUCTOR_MODE=strict
@Conductor
```

### Direct Reference
```
@Conductor --mode=strict
```

## Creating Custom Modes

1. Create a new `.md` file in the appropriate rules directory
2. Document the mode's purpose and rules
3. Include usage examples
4. Reference from agent invocation

## Example Mode File Structure

```markdown
# Mode Name

## Overview
Brief description of the mode

## Rules
Specific rules and behaviors

## Usage
How to activate this mode

## When to Use
Appropriate scenarios for this mode
```

## Management Commands

### RAG System
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart
```

### Index Management
```bash
# Clear index
curl -X DELETE http://localhost:8000/index

# Re-index
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"path": "/workspace"}'
```

## Troubleshooting

### RAG system not starting
```bash
# Check Docker is running
docker info

# Check logs
docker-compose logs

# Ensure ports are available
lsof -i :8000
lsof -i :6333
```

### Slow queries
- Use smaller embedding model
- Reduce top_k parameter
- Increase Docker memory allocation

## Resources

- [.roo/README.md](.roo/README.md) - Full system documentation
- [local-rag-llamaindex/README.md](.roo/local-rag-llamaindex/README.md) - RAG system guide
- Each rules directory has its own README with mode examples

## Support

For issues or questions:
- Check the README files in each directory
- Review mode examples for guidance
- Consult the main project documentation
