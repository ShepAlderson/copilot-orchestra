# Example: Email Validator Utility

This example demonstrates a simple use case of the GitHub Copilot Orchestra system: creating a utility function to validate email addresses with comprehensive tests.

## Scenario

You're working on a Node.js project and need a robust email validation utility. Instead of writing it manually, you'll use the Conductor agent to plan, implement, test, and review the code following TDD principles.

## Initial Request

```
Create a utility function to validate email addresses. 
The function should:
- Check for basic email format (user@domain.ext)
- Validate domain has at least one dot
- Reject invalid characters
- Include comprehensive tests
- Export as a reusable module
```

## Generated Plan

The Conductor created a 3-phase plan:

### Phase 1: Test Suite Setup
- Create test file with failing tests for email validation
- Cover valid, invalid, and edge cases
- Set up test infrastructure

### Phase 2: Implementation
- Implement minimal code to pass tests
- Use regex for validation
- Handle edge cases

### Phase 3: Documentation and Export
- Add JSDoc comments
- Create usage examples
- Ensure proper module export

## Implementation Results

### Files Created

```
src/
└── utils/
    └── emailValidator.js

tests/
└── emailValidator.test.js

docs/
└── emailValidator.md
```

### emailValidator.js

```javascript
/**
 * Validates email addresses according to basic RFC 5322 rules
 * @param {string} email - The email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEmail(email) {
  // Check if email is a string and not empty
  if (typeof email !== 'string' || email.length === 0) {
    return false;
  }

  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return false;
  }

  // Additional validation
  const [localPart, domain] = email.split('@');
  
  // Check length constraints
  if (localPart.length > 64 || domain.length > 255) {
    return false;
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return false;
  }

  // Domain must have at least one dot
  if (!domain.includes('.')) {
    return false;
  }

  return true;
}

module.exports = { isValidEmail };
```

### emailValidator.test.js

```javascript
const { isValidEmail } = require('../src/utils/emailValidator');

describe('Email Validator', () => {
  describe('Valid emails', () => {
    test('accepts standard email format', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });

    test('accepts email with subdomain', () => {
      expect(isValidEmail('user@mail.example.com')).toBe(true);
    });

    test('accepts email with numbers', () => {
      expect(isValidEmail('user123@example.com')).toBe(true);
    });

    test('accepts email with dots in local part', () => {
      expect(isValidEmail('first.last@example.com')).toBe(true);
    });

    test('accepts email with plus sign', () => {
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });
  });

  describe('Invalid emails', () => {
    test('rejects email without @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    test('rejects email without domain', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    test('rejects email without local part', () => {
      expect(isValidEmail('@example.com')).toBe(false);
    });

    test('rejects email without TLD', () => {
      expect(isValidEmail('user@example')).toBe(false);
    });

    test('rejects email with spaces', () => {
      expect(isValidEmail('user name@example.com')).toBe(false);
    });

    test('rejects email with consecutive dots', () => {
      expect(isValidEmail('user..name@example.com')).toBe(false);
    });

    test('rejects empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    test('rejects non-string input', () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail(123)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    test('rejects email with local part too long', () => {
      const longLocal = 'a'.repeat(65) + '@example.com';
      expect(isValidEmail(longLocal)).toBe(false);
    });

    test('accepts email with max length local part', () => {
      const maxLocal = 'a'.repeat(64) + '@example.com';
      expect(isValidEmail(maxLocal)).toBe(true);
    });
  });
});
```

## Workflow Experience

### Phase 1: Test Suite Setup (Completed)

**What happened:**
1. implement-subagent created test file with 15+ test cases
2. Ran tests - all failed as expected (no implementation yet)
3. code-review-subagent verified test quality
4. Status: APPROVED

**Commit:**
```
test: Add comprehensive email validator test suite

- Cover valid email formats
- Test invalid emails and edge cases
- Include length constraints validation
- Test non-string inputs
```

### Phase 2: Implementation (Completed)

**What happened:**
1. implement-subagent implemented validation logic
2. Ran tests - all 18 tests passing
3. Applied linting and formatting
4. code-review-subagent reviewed implementation
5. Status: APPROVED with minor recommendations

**Commit:**
```
feat: Implement email validation utility

- Validate email format using regex
- Check length constraints (local: 64, domain: 255)
- Reject consecutive dots
- Ensure domain has TLD
- Handle edge cases and invalid inputs
```

### Phase 3: Documentation (Completed)

**What happened:**
1. Added JSDoc comments
2. Created usage documentation
3. Added examples
4. code-review-subagent verified completeness
5. Status: APPROVED

**Commit:**
```
docs: Add email validator documentation

- JSDoc comments for function
- Usage examples
- Edge case explanations
```

## Key Takeaways

### What Worked Well

✅ **TDD Process**
- Tests written first caught edge cases early
- Clear requirements from failing tests
- Confidence in implementation correctness

✅ **Incremental Commits**
- Each phase independently committable
- Clear git history
- Easy to review changes

✅ **Code Review**
- Caught potential improvements
- Ensured test coverage
- Validated documentation

### Lessons Learned

💡 **Phase Sizing**
- 3 phases was appropriate for this task
- Each phase took 5-10 minutes
- Could have combined phases 2 and 3 for simpler tasks

💡 **Test Coverage**
- 18 tests seems comprehensive
- Could add more edge cases later
- Balance between thorough and practical

💡 **Documentation**
- JSDoc adds value for reusability
- Usage examples are helpful
- Could add integration examples

## How to Use This Example

### 1. As a Learning Tool

Try recreating this workflow in your own project:
- Copy the initial request
- Let Conductor generate its own plan
- Compare results with this example

### 2. As a Template

Use this pattern for similar utilities:
- String validation functions
- Data transformation utilities
- Helper functions
- Common algorithms

### 3. As a Reference

When working with Conductor:
- See how requests should be structured
- Understand expected phase breakdown
- Review commit message format
- Observe TDD workflow

## Adapting This Example

### For Different Languages

**Python:**
```python
def is_valid_email(email: str) -> bool:
    # Implementation
    pass
```

**Java:**
```java
public class EmailValidator {
    public static boolean isValidEmail(String email) {
        // Implementation
    }
}
```

### For Different Validation Rules

- More strict RFC compliance
- Custom domain whitelist/blacklist
- International email addresses
- Disposable email detection

### For Different Project Types

- React form validation hook
- Express.js middleware
- CLI tool input validation
- API request validation

## Next Steps

After completing this example, try:
1. **Adding features** - Extend with domain verification
2. **Performance testing** - Benchmark validation speed
3. **Integration** - Use in a real application
4. **More complex tasks** - Try multi-file features

## Resources

- [RFC 5322](https://tools.ietf.org/html/rfc5322) - Email format specification
- [Email Regex Patterns](https://emailregex.com/) - Common patterns
- [Jest Documentation](https://jestjs.io/) - Testing framework used

---

**This example took approximately 20-30 minutes from request to completion with the Orchestra system.**
