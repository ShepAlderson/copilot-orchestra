# Rapid Mode Configuration

## Overview
Rapid mode streamlines the workflow for quick iterations and prototyping.

## Rules

### Planning Phase
- Focus on high-level overview
- Skip detailed dependency analysis
- Prioritize speed over thoroughness
- Accept existing patterns without deep research

### Implementation Phase
- Minimum viable tests only
- Focus on happy path coverage
- Basic documentation acceptable
- Skip performance optimization

### Review Phase
- Quick sanity checks only
- Focus on critical issues
- Skip minor style/convention issues
- Accept TODO comments

### Quality Assurance Phase
- Run only affected tests
- Skip security scanning for prototypes
- Allow lower code coverage (60% minimum)
- Quick lint check only

## Usage

Activate rapid mode:
```bash
export CONDUCTOR_MODE=rapid
```

Or in agent invocation:
```
@Conductor --mode=rapid
```

## When to Use

- Prototyping
- Proof of concepts
- Exploratory work
- Non-production branches
- Quick bug fixes
- Demo preparation

## Warnings

⚠️ Never use rapid mode for:
- Production code
- Security features
- Public APIs
- Merge to main branch
