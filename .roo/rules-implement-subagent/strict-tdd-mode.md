# Strict TDD Mode Configuration

## Overview
Strict TDD mode enforces rigorous test-first discipline with detailed test coverage.

## Test-First Workflow

### 1. Write Failing Tests
- Write comprehensive test suite FIRST
- Cover all success cases
- Cover all error cases
- Cover edge cases
- Cover boundary conditions
- Write integration tests where needed

### 2. Verify Tests Fail
- Run test suite
- Confirm all new tests fail appropriately
- Verify failure messages are clear
- Document expected behaviors

### 3. Minimal Implementation
- Write ONLY enough code to pass tests
- No speculative features
- No premature optimization
- Keep it simple

### 4. Verify Tests Pass
- Run full test suite
- Confirm all tests pass
- Check for any test flakiness
- Verify no existing tests broken

### 5. Refactor
- Improve code quality
- Remove duplication
- Enhance readability
- Optimize if needed
- Re-run tests after each change

## Test Quality Standards

### Coverage Requirements
- Line coverage: ≥ 90%
- Branch coverage: ≥ 85%
- Function coverage: 100%

### Test Characteristics
- **Independent**: Tests don't depend on each other
- **Fast**: Each test runs in < 100ms
- **Reliable**: No flaky tests
- **Clear**: Descriptive test names
- **Isolated**: Use mocks/stubs for dependencies

### Test Organization
```
describe('Component/Function')
  describe('#method')
    it('should handle success case')
    it('should handle error case')
    it('should validate inputs')
    it('should handle edge cases')
```

## Code Standards

### Before Writing Code
- [ ] All test cases written
- [ ] Tests fail appropriately
- [ ] Test names are descriptive
- [ ] Expected behaviors documented

### After Writing Code
- [ ] All tests pass
- [ ] No test warnings
- [ ] Code is minimal
- [ ] No dead code
- [ ] Linter passes

## Usage

Activate strict TDD mode:
```bash
export IMPLEMENT_MODE=strict-tdd
```

## When to Use

- New feature development
- API implementation
- Algorithm development
- Bug fixes with regression tests
- Refactoring with safety nets

## Red-Green-Refactor Cycle

```
┌─────────────┐
│  RED        │  Write failing test
│  ❌         │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  GREEN      │  Write minimal code to pass
│  ✅         │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  REFACTOR   │  Improve code quality
│  🔄         │
└─────┬───────┘
      │
      └──────► (Repeat)
```

## Benefits

- Higher code quality
- Better test coverage
- Fewer bugs
- Easier refactoring
- Self-documenting code
- Regression protection
