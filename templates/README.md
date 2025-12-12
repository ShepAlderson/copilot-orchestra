# Agent Templates and Configurations

This directory contains alternative agent configurations and templates for different use cases and project types.

## Available Templates

### Custom Agent Variations

- **security-focused-conductor.agent.md** - Enhanced security review and validation
- **documentation-focused-conductor.agent.md** - Extra emphasis on documentation quality
- **rapid-prototyping-conductor.agent.md** - Faster iteration, minimal documentation

### Project-Specific Configurations

- **nodejs/** - Node.js/TypeScript project settings
- **python/** - Python project configurations
- **frontend/** - React/Vue/Angular optimizations
- **backend/** - API and server-side patterns

## How to Use Templates

### 1. Copy Template to Your Project

```bash
# Copy a template
cp templates/security-focused-conductor.agent.md ./Conductor.agent.md

# Or install globally
cp templates/security-focused-conductor.agent.md \
   ~/Library/Application\ Support/Code\ -\ Insiders/User/prompts/Conductor.agent.md
```

### 2. Customize for Your Needs

Edit the copied agent file:
- Adjust model selection
- Modify workflow rules
- Add project-specific conventions
- Update tool preferences

### 3. Reload VS Code Insiders

```bash
# Restart VS Code Insiders to load the new configuration
```

## Template Descriptions

### Security-Focused Conductor

**When to use:**
- Building security-critical applications
- Handling sensitive data
- Compliance requirements (HIPAA, GDPR, etc.)
- Financial or healthcare projects

**Key differences:**
- Security review before code review
- Input validation requirements
- Authentication/authorization checks
- Dependency vulnerability scanning
- Secure coding practices enforcement

### Documentation-Focused Conductor

**When to use:**
- Open source projects
- API development
- Library/SDK creation
- Team onboarding projects
- Knowledge transfer scenarios

**Key differences:**
- Documentation phase in each cycle
- API documentation requirements
- Usage examples mandatory
- Inline comments expected
- README updates included

### Rapid Prototyping Conductor

**When to use:**
- Proof of concepts
- Hackathons
- Quick experiments
- Learning new technologies
- Throwaway code

**Key differences:**
- Fewer phases per task
- Minimal documentation
- Combined test/implementation phases
- Faster iteration cycles
- Less strict review process

## Project-Specific Templates

### Node.js Configuration

**Includes:**
- npm script conventions
- Jest/Mocha test patterns
- ESLint/Prettier integration
- TypeScript considerations
- Common middleware patterns

### Python Configuration

**Includes:**
- pytest conventions
- Virtual environment handling
- Black/pylint formatting
- Type hints expectations
- Django/Flask patterns

### Frontend Configuration

**Includes:**
- Component testing patterns
- State management approaches
- Build process integration
- Accessibility requirements
- Browser compatibility checks

## Creating Your Own Template

### 1. Start with Base Agent

Copy an existing agent file as starting point:
```bash
cp Conductor.agent.md templates/my-custom-conductor.agent.md
```

### 2. Identify Customizations

Consider:
- What's unique about your project?
- What conventions should be enforced?
- What tools are you using?
- What's your team's workflow?

### 3. Modify Agent Instructions

Update sections:
- **Workflow** - Add/remove/modify phases
- **Plan Style** - Adjust phase structure
- **Review Criteria** - Change what gets reviewed
- **Commit Format** - Match your git conventions

### 4. Test Thoroughly

- Try with simple tasks first
- Verify all phases work correctly
- Test error handling
- Get team feedback

### 5. Share with Community

Consider contributing back:
- Create PR with your template
- Add README explaining use case
- Include example scenarios
- Document customizations

## Tips for Template Customization

### Model Selection

Choose based on your priorities:
- **Claude Sonnet 4.5** - Best quality, slower, higher cost
- **Claude Haiku 4.5** - Fast, good quality, cost-effective
- **GPT-4o** - Alternative for variety
- **Gemini 2.5 Pro** - Another powerful option

### Tool Configuration

Enable tools you need:
```yaml
tools: [
  'edit',           # File editing
  'search',         # Code search
  'runCommands',    # Terminal access
  'runTasks',       # VS Code tasks
  'runSubagent',    # Invoke other agents
  'fetch',          # HTTP requests
  'githubRepo',     # GitHub API
]
```

### Workflow Customization

Modify the workflow section to:
- Add phases (e.g., security review, performance testing)
- Change phase order
- Add mandatory checks
- Include custom validation

### Adding Project Conventions

Include in agent instructions:
```markdown
<project_conventions>
- Use TypeScript strict mode
- All functions must have JSDoc
- Test coverage minimum 80%
- Follow Airbnb style guide
- Use functional components in React
</project_conventions>
```

## Example Customizations

### Adding a Security Phase

```markdown
## Phase 2.5: Security Review (After Implementation)

1. **Security Analysis**: Check for:
   - SQL injection vulnerabilities
   - XSS vulnerabilities
   - Authentication issues
   - Authorization bypasses
   - Sensitive data exposure
   
2. **Required Actions**:
   - Run security linters
   - Manual code review for security
   - Update threat model if needed
```

### Enforcing Code Coverage

```markdown
### 2C. Return to User for Commit

Before presenting summary:
1. **Run coverage report**: Execute `npm run coverage`
2. **Verify threshold**: Ensure >= 80% coverage
3. **Block if insufficient**: Do not proceed if coverage < threshold
```

### Adding Performance Testing

```markdown
## Phase 2.7: Performance Validation

1. **Benchmark Tests**: 
   - Run performance benchmarks
   - Compare against baseline
   - Identify regressions
   
2. **Acceptance Criteria**:
   - No performance degradation > 10%
   - Memory usage within limits
   - Response time meets SLAs
```

## Community Templates

Have you created a useful template? Share it!

### Submission Process

1. Fork the repository
2. Add your template to `templates/`
3. Include detailed README
4. Add example scenarios
5. Submit pull request

### Quality Standards

Templates should:
- Be well-documented
- Include use case description
- Provide example output
- Be tested thoroughly
- Follow naming conventions

## Support

Questions about templates?
- Open an issue with "templates" label
- Check existing discussions
- Review CONTRIBUTING.md

---

**Happy customizing!** 🎨
