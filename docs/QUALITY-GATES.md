# Quality Gates Documentation

This document describes the quality assurance system integrated into GitHub Copilot Orchestra, including quality standards, gates, and the QA subagent workflow.

## Overview

The Quality Assurance (QA) system adds an automated quality gate between code review and commit. It validates code quality, security, test coverage, and performance to ensure all changes meet high standards before being committed to the repository.

## Workflow Integration

### Before QA System:
```
Implement → Code Review → Commit
```

### With QA System:
```
Implement → Code Review → Quality Assurance → Commit
```

The QA subagent runs after the code-review-subagent approves changes but before the commit step, providing a final quality gate.

## Quality Assurance Subagent

### Purpose

The `quality-assurance-subagent` is a specialized agent that:
- Validates code quality (linting, formatting, style)
- Checks for security vulnerabilities
- Analyzes test coverage
- Assesses performance implications
- Verifies documentation quality

### Invocation

The Conductor agent invokes the QA subagent automatically after code review:

```markdown
@quality-assurance-subagent

Please perform quality assurance on the changes for Phase X: [Description]

Files modified:
- src/file1.js
- tests/file1.test.js

Run appropriate linters, check test coverage, validate security, and assess code quality.
```

### QA Report Format

The QA subagent returns a structured report:

```markdown
## Quality Assurance Report

**Status:** PASS / FAIL / ADVISORY

**Summary:** Brief overview of quality assessment

### Code Quality: ✅ / ⚠️ / ❌
- Specific findings

### Security: ✅ / ⚠️ / ❌
- Security findings

### Test Coverage: ✅ / ⚠️ / ❌
- Coverage metrics and findings

### Performance: ✅ / ⚠️ / ❌
- Performance findings

### Documentation: ✅ / ⚠️ / ❌
- Documentation findings

### Critical Issues (Must Fix):
1. Issue descriptions

### Warnings (Should Fix):
1. Warning descriptions

### Recommendations (Nice to Have):
1. Recommendation descriptions

**Verdict:** [PASS/FAIL/ADVISORY explanation]
```

## Quality Standards

### Minimum Standards for PASS

Code must meet all of these criteria to receive a PASS verdict:

1. ✅ **No critical security vulnerabilities**
   - No SQL injection, XSS, or other OWASP Top 10 risks
   - No exposed credentials or API keys
   - Input validation present where needed

2. ✅ **No linting errors**
   - Linting warnings acceptable with justification
   - Code follows project style guide
   - Consistent formatting

3. ✅ **Tests exist for new/changed functionality**
   - Unit tests for new functions/methods
   - Integration tests for API endpoints
   - Edge cases covered

4. ✅ **All tests pass**
   - No failing tests
   - No flaky tests
   - Test suite completes successfully

5. ✅ **Test coverage ≥ 70% for new code**
   - Line coverage for new files
   - Branch coverage for complex logic
   - Measurable if coverage tools available

6. ✅ **Documentation updated**
   - Public API changes documented
   - Breaking changes noted
   - README updated if interface changes

### Automatic FAIL Conditions

These issues trigger an automatic FAIL verdict:

❌ **Security Vulnerabilities**
- SQL injection risks
- XSS vulnerabilities
- Exposed secrets or credentials
- Authentication/authorization bypasses
- Command injection risks

❌ **Test Failures**
- Any test in the suite fails
- Tests can't execute due to errors

❌ **Build-Breaking Linting Errors**
- Syntax errors
- Import/dependency errors
- Configuration errors that prevent build

❌ **Missing Tests**
- New functionality has no tests
- Changed functionality has no tests
- Critical paths untested

❌ **Hardcoded Secrets**
- API keys in code
- Database passwords in code
- Private keys in repository

### ADVISORY Conditions

These conditions result in PASS with warnings:

⚠️ **Linting Warnings** (not errors)
- Style inconsistencies
- Complexity warnings
- Unused variables (if intentional)

⚠️ **Test Coverage 60-70%**
- Below ideal but acceptable
- Should improve over time

⚠️ **Minor Performance Concerns**
- Suboptimal but not user-impacting
- Room for optimization

⚠️ **Documentation Gaps**
- Internal functions not documented
- Comments could be clearer
- Examples would help

⚠️ **TODO Comments**
- Future improvements noted
- Non-critical refactoring needed

## Quality Checks by Category

### 1. Code Quality

**What's Checked:**
- Linting passes (ESLint, Pylint, RuboCop, etc.)
- Formatting consistent (Prettier, Black, gofmt)
- Naming conventions followed
- Function/method sizes reasonable (< 50 lines ideal)
- No commented-out code
- No debug statements (console.log, print) unless intentional

**Tools Used:**
- Project-configured linters (`.eslintrc`, `pylintrc`, etc.)
- Project-configured formatters
- Built-in language analyzers

**Pass Criteria:**
- Zero linting errors
- Warnings acceptable if justified
- Code follows project conventions

### 2. Security

**What's Checked:**
- Input validation present
- Output encoding applied
- No SQL injection risks (parameterized queries)
- No XSS vulnerabilities (sanitized inputs)
- Authentication/authorization correct
- No exposed secrets
- Secure dependencies (no known CVEs)
- Proper error handling (no info leakage)

**Tools Used:**
- Manual code review for common patterns
- Dependency checkers (npm audit, pip-audit)
- Secret scanners (grep for common patterns)
- Project-specific security tools

**Pass Criteria:**
- Zero critical vulnerabilities
- Security best practices followed
- Sensitive data protected

### 3. Test Coverage

**What's Checked:**
- Tests exist for new functionality
- Tests exist for changed functionality
- Edge cases covered
- Error conditions tested
- Coverage metrics if available
- Test quality (not just presence)

**Tools Used:**
- Project test framework (Jest, pytest, JUnit)
- Coverage tools (nyc, pytest-cov, JaCoCo)
- Test execution

**Pass Criteria:**
- All tests pass
- Coverage ≥ 70% for new code
- Edge cases covered
- Tests are meaningful

### 4. Performance

**What's Checked:**
- No obvious anti-patterns (N+1 queries)
- Appropriate data structures
- Database queries optimized
- Memory leaks avoided
- Resource cleanup (files, connections)
- Large data handled in chunks

**Tools Used:**
- Code review for patterns
- Profilers if significant performance concerns
- Database query analyzers

**Pass Criteria:**
- No major performance regressions
- Resources properly managed
- Scalability considered

### 5. Documentation

**What's Checked:**
- Public APIs documented
- Complex logic explained
- JSDoc/docstrings present
- README updated if needed
- Breaking changes documented
- Migration guides provided

**Tools Used:**
- Manual documentation review
- Link checkers
- Markdown validators

**Pass Criteria:**
- Public interfaces documented
- Breaking changes noted
- User-facing docs updated

## Language-Specific Guidelines

### JavaScript/TypeScript

**Linting:** ESLint with project config
```bash
npx eslint src/
```

**Formatting:** Prettier
```bash
npx prettier --check src/
```

**Testing:** Jest, Mocha, or project framework
```bash
npm test
npm test -- --coverage
```

**Minimum Standards:**
- ESLint errors: 0
- Test coverage: ≥70%
- All tests passing

### Python

**Linting:** Pylint, Flake8, or Ruff
```bash
pylint src/
flake8 src/
```

**Formatting:** Black
```bash
black --check src/
```

**Testing:** pytest or unittest
```bash
pytest tests/ -v
pytest tests/ --cov=src
```

**Minimum Standards:**
- Pylint score: ≥8.0/10
- Test coverage: ≥70%
- All tests passing

### Java

**Linting:** Checkstyle, PMD
```bash
mvn checkstyle:check
mvn pmd:check
```

**Testing:** JUnit
```bash
mvn test
mvn jacoco:report
```

**Minimum Standards:**
- Zero checkstyle violations
- Test coverage: ≥70%
- All tests passing

### Go

**Linting:** golangci-lint
```bash
golangci-lint run
```

**Formatting:** gofmt
```bash
gofmt -l .
```

**Testing:** go test
```bash
go test ./...
go test -cover ./...
```

**Minimum Standards:**
- No linting errors
- Test coverage: ≥70%
- All tests passing

## Configuration

### Project-Specific Standards

Projects can customize quality standards by creating a `.qa-config.json` file:

```json
{
  "minCoverage": 80,
  "strictMode": false,
  "linting": {
    "enabled": true,
    "errorOnly": false
  },
  "security": {
    "enabled": true,
    "skipPatterns": []
  },
  "performance": {
    "enabled": true,
    "benchmarks": false
  },
  "documentation": {
    "required": ["public-apis"],
    "optional": ["internal-functions"]
  }
}
```

### Strict Mode vs Advisory Mode

**Advisory Mode (Default):**
- Warnings don't block commits
- Focus on critical issues only
- Enables fast iteration

**Strict Mode:**
- All warnings must be addressed
- Higher quality bar
- Slower but more thorough

Enable strict mode in `.qa-config.json`:
```json
{
  "strictMode": true
}
```

## Interpreting QA Reports

### Status: PASS ✅

**Meaning:** Code meets all quality standards and is safe to commit.

**Action:** Proceed to commit step.

**Example:**
```markdown
**Status:** PASS

All quality checks passed. Code is well-tested, secure, and follows 
best practices. Ready for commit.
```

### Status: ADVISORY ⚠️

**Meaning:** Code is acceptable but has warnings that should be addressed.

**Action:** Proceed to commit with notes about warnings. Consider fixing in future.

**Example:**
```markdown
**Status:** ADVISORY

Code passes critical checks but has minor warnings:
- Test coverage is 65% (below 70% ideal)
- 3 linting warnings about variable naming

These can be addressed in a follow-up commit.
```

### Status: FAIL ❌

**Meaning:** Code has critical issues that must be fixed before commit.

**Action:** Return to implementation phase and fix critical issues.

**Example:**
```markdown
**Status:** FAIL

Critical issues found:
1. SQL query uses string concatenation (SQL injection risk)
2. Tests fail: 3 of 15 tests failing
3. API key hardcoded in config.js

These must be fixed before proceeding.
```

## Best Practices

### 1. Run Quality Checks Locally First

Before the QA subagent runs, developers should:
```bash
# Run linter
npm run lint    # or appropriate command

# Run tests
npm test

# Check coverage
npm test -- --coverage

# Format code
npm run format
```

### 2. Address Issues Incrementally

- Fix critical issues immediately (FAIL)
- Note advisory issues for future improvement
- Don't let warnings accumulate

### 3. Maintain Quality Standards

- Keep test coverage above 70%
- Fix linting warnings promptly
- Update documentation with changes
- Run security checks regularly

### 4. Balance Speed and Quality

- Use advisory mode for rapid prototyping
- Use strict mode for production code
- Adjust standards based on project phase
- Focus on critical issues first

### 5. Learn from QA Reports

- Review patterns in warnings
- Improve coding habits
- Update project standards
- Share learnings with team

## Troubleshooting

### QA Subagent Not Running

**Symptom:** Code review proceeds directly to commit without QA check.

**Solution:**
1. Verify `quality-assurance-subagent.agent.md` exists
2. Check Conductor invokes QA subagent in workflow
3. Ensure subagent appears in VS Code Insiders agent list

### False Positives

**Symptom:** QA subagent reports issues that aren't really problems.

**Solution:**
1. Review the specific finding
2. Add exceptions to `.qa-config.json` if appropriate
3. Provide context in code comments
4. Update QA standards if consistently wrong

### Missing Tools

**Symptom:** QA reports "No linting configuration found" or similar.

**Solution:**
1. Add linting config (`.eslintrc.js`, `pylintrc`, etc.)
2. Install linting tools: `npm install -D eslint` or equivalent
3. Add lint script to `package.json` scripts
4. Document in README

### Coverage Tools Not Found

**Symptom:** QA can't measure test coverage.

**Solution:**
1. Install coverage tools: `npm install -D nyc` or `pip install pytest-cov`
2. Add coverage script: `"test:coverage": "jest --coverage"`
3. Configure coverage thresholds in test config
4. Document in README

## Integration with CI/CD

The QA subagent complements but doesn't replace CI/CD checks:

**Local Development (QA Subagent):**
- Immediate feedback during development
- Interactive quality checks
- Customizable per developer workflow

**CI/CD Pipeline:**
- Automated checks on every commit
- Consistent enforcement across team
- Gating for pull requests
- Deployment validation

**Best Practice:** Use both!
- QA subagent for rapid local feedback
- CI/CD for team-wide enforcement

Example GitHub Actions workflow:
```yaml
name: Quality Checks
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm test
      - name: Coverage
        run: npm test -- --coverage
      - name: Security audit
        run: npm audit
```

## Examples

### Example 1: New Feature Passes QA

**Scenario:** Adding user authentication endpoint

**QA Report:**
```markdown
## Quality Assurance Report

**Status:** PASS

**Summary:** New authentication endpoint meets all quality standards.

### Code Quality: ✅
- ESLint passes with zero errors
- Code follows project conventions
- Functions properly sized and named

### Security: ✅
- Passwords hashed with bcrypt
- JWT tokens properly signed
- Input validation present
- No secrets exposed

### Test Coverage: ✅
- Coverage: 85% (12 tests)
- Success and error cases covered
- Edge cases tested

### Performance: ✅
- Database queries optimized
- Password hashing async
- No blocking operations

### Documentation: ✅
- API endpoint documented
- Authentication flow explained
- Error responses documented

**Verdict:** PASS - Ready for commit
```

### Example 2: Security Issue Fails QA

**Scenario:** Adding data export feature

**QA Report:**
```markdown
## Quality Assurance Report

**Status:** FAIL

**Summary:** Critical security vulnerability found in export feature.

### Code Quality: ✅
- ESLint passes
- Code well-structured

### Security: ❌
- **CRITICAL**: SQL injection vulnerability in export query
  File: src/exports/dataExporter.js:23
  Issue: User input directly concatenated into SQL query
  Fix: Use parameterized queries

### Test Coverage: ⚠️
- Coverage: 68% (slightly below target)
- Missing test for malicious input handling

### Performance: ✅
- Proper streaming for large exports

### Documentation: ✅
- Feature documented

### Critical Issues:
1. SQL injection in dataExporter.js line 23 - Use parameterized query

**Verdict:** FAIL - Security issue must be fixed before commit
```

### Example 3: Advisory for Minor Issues

**Scenario:** Refactoring data processing

**QA Report:**
```markdown
## Quality Assurance Report

**Status:** ADVISORY

**Summary:** Refactoring successful with minor quality warnings.

### Code Quality: ⚠️
- ESLint: 2 warnings about complexity
  - processData() function has complexity 12 (threshold 10)
  - Consider breaking into smaller functions

### Security: ✅
- No security concerns

### Test Coverage: ⚠️
- Coverage: 65% (below 70% target)
- Existing tests pass
- Could add tests for edge cases

### Performance: ✅
- Improved from previous implementation
- No regressions detected

### Documentation: ✅
- Code comments updated
- README unchanged (not needed)

### Warnings:
1. Function complexity in processData() - Consider refactoring
2. Test coverage at 65% - Add edge case tests

**Verdict:** ADVISORY - Acceptable to commit, address warnings in follow-up
```

## Summary

The Quality Assurance system provides automated, comprehensive quality checks before code is committed. By catching issues early and consistently enforcing standards, it helps maintain high code quality while enabling rapid development velocity.

**Key Benefits:**
- 🛡️ Catches security vulnerabilities before commit
- ✅ Ensures test coverage meets standards
- 🎯 Enforces code quality consistently
- 📚 Validates documentation completeness
- ⚡ Provides immediate feedback during development

**Getting Started:**
1. Ensure `quality-assurance-subagent.agent.md` is in your `.github/agents/` directory
2. The updated `Conductor.agent.md` already includes QA phase
3. Configure project linting and testing tools
4. Run a test implementation phase and review QA report
5. Adjust quality standards in `.qa-config.json` as needed

For questions or issues, refer to the [Troubleshooting Guide](../TROUBLESHOOTING.md) or open an issue on GitHub.
