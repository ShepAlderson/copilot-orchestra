# Deep Research Mode Configuration

## Overview
Deep research mode enables comprehensive analysis with extensive file reading and context gathering.

## Research Strategy

### Scope
- Read all relevant files completely
- Analyze entire dependency chains
- Review historical changes (git log)
- Study similar patterns in codebase
- Check external documentation

### Analysis Depth
- Architectural patterns
- Design decisions rationale
- Performance characteristics
- Security implications
- Scalability considerations
- Integration points

### Context Gathering
- Related test files
- Configuration files
- Documentation
- Comments and TODOs
- Recent pull requests
- Issue references

## Output Requirements

Provide structured findings including:

### 1. Architecture Overview
- System components
- Data flow
- Key abstractions
- Design patterns used

### 2. Relevant Code Locations
- Primary files to modify
- Test files to update
- Configuration to adjust
- Documentation to update

### 3. Constraints & Considerations
- Technical limitations
- Performance requirements
- Security requirements
- Backward compatibility needs

### 4. Implementation Recommendations
- Preferred approaches
- Alternative options
- Trade-off analysis
- Risk assessment

## Usage

Activate deep research mode:
```bash
export PLANNING_MODE=deep-research
```

## When to Use

- Complex architectural changes
- Unfamiliar codebases
- Critical system components
- Large refactoring projects
- Security-sensitive features
- Performance optimization tasks

## Performance Note

Deep research mode is slower but provides comprehensive understanding. Allow extra time for planning phase.
