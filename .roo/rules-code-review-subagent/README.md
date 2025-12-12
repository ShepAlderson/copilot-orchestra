# Code Review Subagent Rules

This directory contains mode-specific rules and configurations for the Code Review subagent.

## Purpose

The Code Review subagent specializes in:
- Reviewing uncommitted code changes using git
- Validating test coverage and code quality
- Identifying potential issues and improvements
- Returning structured review results (APPROVED/NEEDS_REVISION/FAILED)

## Mode Configurations

Add mode-specific configuration files here to customize Code Review behavior:

### Example Modes
- **strict-review-mode**: Comprehensive review with high standards
- **security-focused-mode**: Emphasis on security vulnerabilities and best practices
- **performance-review-mode**: Focus on performance implications
- **accessibility-mode**: Review for accessibility compliance
- **quick-review-mode**: Fast review for minor changes

## Configuration Format

Create mode configuration files as:
- `{mode-name}.md` - Markdown-based review checklists and criteria
- `{mode-name}.yaml` - Structured quality gates and thresholds

## Usage

Reference these modes to adjust review depth, focus areas, and acceptance criteria based on the nature of changes.
