# Security Focused Review Mode

## Overview
Security-focused mode emphasizes security vulnerabilities and best practices during code review.

## Security Checklist

### 1. Input Validation
- [ ] All user inputs are validated
- [ ] Input length limits enforced
- [ ] Type checking implemented
- [ ] Sanitization applied where needed
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Command injection prevention

### 2. Authentication & Authorization
- [ ] Authentication required where needed
- [ ] Authorization checks present
- [ ] Session management secure
- [ ] Token handling proper
- [ ] Password policies enforced
- [ ] Multi-factor authentication supported

### 3. Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Sensitive data encrypted in transit
- [ ] No secrets in code
- [ ] Environment variables used properly
- [ ] Secure key management
- [ ] PII handling compliant

### 4. API Security
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] CSRF protection enabled
- [ ] API keys secured
- [ ] Request size limits enforced
- [ ] Proper error messages (no info leakage)

### 5. Dependency Security
- [ ] Dependencies up to date
- [ ] Known vulnerabilities checked
- [ ] Minimal dependencies used
- [ ] Supply chain verified
- [ ] License compliance checked

### 6. Error Handling
- [ ] No stack traces in production
- [ ] Generic error messages to users
- [ ] Detailed logging for debugging
- [ ] Sensitive data not logged
- [ ] Error recovery implemented

### 7. Code Quality Security
- [ ] No hardcoded credentials
- [ ] No commented-out security code
- [ ] Secure defaults used
- [ ] Principle of least privilege
- [ ] Defense in depth applied

## Common Vulnerabilities

### Critical (Must Fix)
- SQL Injection
- Remote Code Execution
- Authentication bypass
- Authorization bypass
- Hardcoded secrets
- Insecure deserialization

### High (Should Fix)
- XSS vulnerabilities
- CSRF vulnerabilities
- Insecure direct object references
- Security misconfiguration
- Broken access control
- Cryptographic failures

### Medium (Consider Fixing)
- Information disclosure
- Missing security headers
- Weak password policies
- Insufficient logging
- Outdated dependencies

### Low (Nice to Fix)
- Missing input validation
- Verbose error messages
- Missing rate limiting
- CORS misconfiguration

## Review Process

### 1. Automated Scanning
Run security scanners:
```bash
# Dependency scanning
npm audit
pip-audit
snyk test

# SAST scanning
semgrep --config=auto
bandit -r .
eslint --plugin security
```

### 2. Manual Review
- Review authentication flows
- Check authorization logic
- Examine input handling
- Verify data encryption
- Check secret management

### 3. Threat Modeling
- Identify attack surfaces
- Assess risk levels
- Evaluate mitigation strategies
- Consider abuse cases

## Review Criteria

### APPROVED
- No critical or high vulnerabilities
- All security best practices followed
- Secrets properly managed
- Input validation comprehensive
- Error handling secure

### NEEDS_REVISION
- Medium vulnerabilities present
- Some best practices missing
- Improvements recommended

### FAILED
- Critical vulnerabilities found
- High-risk security issues
- Hardcoded secrets
- Missing authentication
- Insecure data handling

## Usage

Activate security-focused mode:
```bash
export REVIEW_MODE=security-focused
```

## When to Use

- Authentication changes
- Authorization changes
- Payment processing
- PII handling
- External API integration
- Security patches
- Compliance requirements

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Security Headers](https://securityheaders.com/)
- [NIST Guidelines](https://www.nist.gov/cybersecurity)
