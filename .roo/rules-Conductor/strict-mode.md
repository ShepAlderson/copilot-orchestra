# Strict Mode Configuration

## Overview
Strict mode enables extra validation and quality checks at each phase of the development cycle.

## Rules

### Planning Phase
- Require comprehensive research including:
  - Complete file analysis
  - Dependency mapping
  - Risk assessment
  - Alternative approaches evaluation

### Implementation Phase
- Enforce minimum test coverage: 90%
- Require edge case testing
- Mandate documentation for all public APIs
- Require performance benchmarks for critical paths

### Review Phase
- Enable comprehensive security scanning
- Require manual review acknowledgment
- Check for accessibility compliance
- Validate backward compatibility

### Quality Assurance Phase
- Run full test suite (not just changed tests)
- Perform memory leak detection
- Check for code duplication
- Validate error handling completeness

## Usage

Activate strict mode by setting an environment variable:
```bash
export CONDUCTOR_MODE=strict
```

Or reference in agent invocation:
```
@Conductor --mode=strict
```

## When to Use

- Production releases
- Security-critical features
- Public API changes
- Major refactors
- Pre-merge to main branch
