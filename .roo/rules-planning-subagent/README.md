# Planning Subagent Rules

This directory contains mode-specific rules and configurations for the Planning subagent.

## Purpose

The Planning subagent is responsible for:
- Research and context gathering
- Codebase structure analysis
- Identifying relevant files and functions
- Returning structured findings to inform plan creation

## Mode Configurations

Add mode-specific configuration files here to customize Planning behavior:

### Example Modes
- **deep-research-mode**: Comprehensive analysis with extensive file reading
- **quick-scan-mode**: Fast, high-level overview for simple tasks
- **architecture-focus-mode**: Emphasis on architectural patterns and design decisions
- **dependency-analysis-mode**: Focus on dependencies and integration points

## Configuration Format

Create mode configuration files as:
- `{mode-name}.md` - Markdown-based research guidelines
- `{mode-name}.yaml` - Structured search and analysis parameters

## Usage

Reference these modes to adjust research depth, focus areas, and analysis patterns based on task requirements.
