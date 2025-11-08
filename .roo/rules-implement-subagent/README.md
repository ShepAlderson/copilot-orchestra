# Implementation Subagent Rules

This directory contains mode-specific rules and configurations for the Implementation subagent.

## Purpose

The Implementation subagent specializes in:
- Executing individual phases of the development plan
- Following strict Test-Driven Development (TDD) principles
- Writing failing tests first, then minimal code to pass
- Linting and formatting code

## Mode Configurations

Add mode-specific configuration files here to customize Implementation behavior:

### Example Modes
- **strict-tdd-mode**: Rigorous test-first discipline with detailed test coverage
- **refactor-mode**: Focus on code improvement without changing behavior
- **feature-mode**: New feature development with comprehensive tests
- **bugfix-mode**: Bug resolution with regression tests
- **performance-mode**: Optimization with benchmark tests

## Configuration Format

Create mode configuration files as:
- `{mode-name}.md` - Markdown-based implementation guidelines
- `{mode-name}.yaml` - Structured coding standards and test patterns

## Usage

Reference these modes to adapt implementation approach based on the type of work being performed.
