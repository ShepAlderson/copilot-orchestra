# Quality Assurance Subagent Rules

This directory contains mode-specific rules and configurations for the Quality Assurance subagent.

## Purpose

The Quality Assurance subagent validates:
- Code quality (linting, formatting, style)
- Security vulnerabilities
- Test coverage metrics
- Performance implications
- Overall system health

## Mode Configurations

Add mode-specific configuration files here to customize QA behavior:

### Example Modes
- **comprehensive-qa-mode**: Full suite of quality checks including security scans
- **security-audit-mode**: Deep security vulnerability analysis
- **performance-audit-mode**: Detailed performance profiling and benchmarking
- **coverage-focused-mode**: Emphasis on test coverage metrics
- **quick-qa-mode**: Essential quality checks for minor changes

## Configuration Format

Create mode configuration files as:
- `{mode-name}.md` - Markdown-based QA checklists and standards
- `{mode-name}.yaml` - Structured quality thresholds and tool configurations

## Usage

Reference these modes to adjust QA depth, tool selection, and pass/fail criteria based on project requirements and change significance.
