# .roo Configuration Directory

This directory contains MODE-specific rules and configurations for all GitHub Copilot Orchestra agents and subagents.

## Directory Structure

```
.roo/
├── rules-Conductor/              # Rules for the main Conductor agent
├── rules-planning-subagent/      # Rules for the Planning subagent
├── rules-implement-subagent/     # Rules for the Implementation subagent
├── rules-code-review-subagent/   # Rules for the Code Review subagent
├── rules-quality-assurance-subagent/  # Rules for the Quality Assurance subagent
└── local-rag-llamaindex/         # Local RAG system using LlamaIndex
```

## Purpose

Each `rules-{AgentName}` directory can contain:
- **Mode-specific instructions**: Custom behaviors for different operational modes
- **Configuration files**: Agent-specific settings and parameters
- **Templates**: Reusable templates for that agent's outputs
- **Tools**: Agent-specific utilities and helpers

## Usage

Agents can reference these rules to adapt their behavior based on:
- Project context
- Development phase
- Team preferences
- Specific workflow requirements

## Local RAG System

The `local-rag-llamaindex/` directory contains a Docker-based Retrieval-Augmented Generation (RAG) system using LlamaIndex. This enables agents to:
- Query project documentation intelligently
- Retrieve relevant code context
- Provide more informed recommendations
- Maintain consistency with project standards

See `local-rag-llamaindex/README.md` for setup and usage instructions.

## Contributing

When adding new agents or modifying existing ones, ensure corresponding rules directories are created and documented.
