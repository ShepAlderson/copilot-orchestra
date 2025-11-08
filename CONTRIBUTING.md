# Contributing to GitHub Copilot Orchestra

Thank you for your interest in contributing to GitHub Copilot Orchestra! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Spam or excessive self-promotion
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers will address violations of the code of conduct. If you experience or witness unacceptable behavior, please report it by opening an issue.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**When reporting a bug, include:**
- Clear, descriptive title
- Detailed steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or error messages if applicable
- Your environment:
  - VS Code Insiders version
  - Operating system
  - GitHub Copilot version
  - Agent configuration (remove sensitive data)

**Template:**
```markdown
**Description:**
Brief description of the bug

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- VS Code Insiders: [version]
- OS: [Windows/Mac/Linux + version]
- Agent models: [which models you're using]

**Screenshots/Logs:**
[If applicable]
```

### Suggesting Enhancements

We welcome feature requests and enhancement ideas!

**Before suggesting an enhancement:**
- Check existing issues and discussions
- Review IMPROVEMENTS.md for planned features
- Consider if it fits the project's goals

**Include in your suggestion:**
- Clear, descriptive title
- Detailed description of the proposed feature
- Why this enhancement would be useful
- Examples of how it would work
- Potential implementation approach (optional)

### Contributing Documentation

Documentation improvements are always welcome!

**Areas where you can help:**
- Fix typos or clarify confusing sections
- Add examples and use cases
- Create tutorials or guides
- Translate documentation
- Improve existing examples
- Add troubleshooting solutions

**To contribute documentation:**
1. Fork the repository
2. Make your changes
3. Submit a pull request with clear description

### Creating Examples

Real-world examples help users understand the system.

**Example contributions should include:**
- Complete, working code
- README explaining the scenario
- Sample plan file
- Phase completion files
- Expected outcomes
- Any prerequisites or setup

**Example structure:**
```
examples/
└── your-example-name/
    ├── README.md
    ├── src/
    │   └── [your code]
    ├── tests/
    │   └── [your tests]
    └── plans/
        ├── example-plan.md
        └── example-phase-1-complete.md
```

### Contributing Agent Templates

Share specialized agent configurations for specific use cases.

**Template contributions should include:**
- `.agent.md` file with clear naming
- README describing the use case
- When to use this template vs standard agents
- Any customizations and why they're needed
- Example of the agent in action

**Place templates in:**
```
templates/
└── category/
    ├── template-name.agent.md
    └── README.md
```

## Getting Started

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/copilot-orchestra.git
   cd copilot-orchestra
   ```

2. **Install VS Code Insiders**
   - Download from: https://code.visualstudio.com/insiders/

3. **Set up agents locally**
   - Use the workspace file: `code-insiders copilot-orchestra.code-workspace`
   - Or copy `.github/agents/` directory to your test project
   - Or install globally for testing

4. **Create a test branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Testing Your Changes

#### For Agent Changes:

1. **Test with simple tasks first**
   - Try basic requests
   - Verify expected behavior
   - Check error handling

2. **Test with complex scenarios**
   - Multi-phase plans
   - Error cases
   - Edge conditions

3. **Test all agents together**
   - Verify Conductor integration
   - Check subagent invocations
   - Confirm workflow completion

4. **Document test cases**
   - What you tested
   - Expected results
   - Actual outcomes

#### For Documentation Changes:

1. **Review formatting**
   - Check Markdown rendering
   - Verify links work
   - Ensure code blocks are formatted

2. **Test examples**
   - Follow your own instructions
   - Verify commands work
   - Check for typos

3. **Get feedback**
   - Ask others to review
   - Test with fresh perspective

## Development Process

### Branching Strategy

- `main` - Stable, released version
- `develop` - Integration branch for next release
- `feature/feature-name` - New features
- `bugfix/issue-description` - Bug fixes
- `docs/what-changed` - Documentation updates

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/descriptive-name
   ```

2. **Make your changes**
   - Follow style guidelines
   - Keep changes focused
   - Add tests if applicable

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: descriptive commit message"
   ```
   
   Use conventional commit format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance

4. **Push to your fork**
   ```bash
   git push origin feature/descriptive-name
   ```

## Submitting Changes

### Pull Request Process

1. **Before submitting:**
   - Test your changes thoroughly
   - Update documentation if needed
   - Ensure no merge conflicts with main
   - Review your own changes first

2. **Create pull request:**
   - Use descriptive title
   - Fill out PR template completely
   - Link related issues
   - Add screenshots/examples if relevant

3. **PR description should include:**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Code refactoring
   
   ## Testing
   How you tested these changes
   
   ## Checklist
   - [ ] Tested locally
   - [ ] Updated documentation
   - [ ] No breaking changes
   - [ ] Follows style guidelines
   ```

4. **After submitting:**
   - Respond to reviewer feedback
   - Make requested changes
   - Keep PR updated with main branch

### Review Process

- Maintainers will review your PR
- May request changes or clarifications
- Be patient and responsive
- Discussion is encouraged!

**What reviewers look for:**
- Code quality and maintainability
- Alignment with project goals
- Documentation completeness
- Test coverage
- No breaking changes without discussion

## Style Guidelines

### Agent File Guidelines

**Frontmatter format:**
```yaml
---
description: 'Clear, concise description of agent purpose'
tools: ['tool1', 'tool2', 'tool3']
model: Claude Sonnet 4.5 (copilot)
---
```

**Agent content:**
- Use clear, imperative language
- Structure with markdown headings
- Include examples where helpful
- Keep instructions concise
- Use code blocks for formatting templates

**Best practices:**
- One clear purpose per agent
- Explicit workflow steps
- Clear stop/pause points
- Error handling guidance
- Examples of good outputs

### Markdown Style

- Use ATX-style headers (`#`, `##`, etc.)
- Include table of contents for long documents
- Use code blocks with language tags
- Add line breaks between sections
- Use lists for steps and options
- Bold for emphasis, italics sparingly
- Include emoji sparingly for visual scanning

### Code Examples

- Include complete, working examples
- Add comments for clarity
- Show expected output
- Demonstrate error handling
- Keep examples simple but realistic

### Commit Messages

Follow conventional commits:
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting changes
- `refactor:` - Code restructuring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
feat: Add new troubleshooting guide

Comprehensive guide covering common issues users encounter
with installation, agent configuration, and workflow problems.

Closes #123
```

```bash
fix: Correct YAML frontmatter in implement-subagent

The tools array was missing quotes around tool names, causing
parsing errors in some VS Code versions.
```

## Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions, ideas, and general discussion
- **Pull Requests** - Code contributions and reviews

### Getting Help

- Review documentation first (README, QUICKSTART, TROUBLESHOOTING)
- Search existing issues and discussions
- Ask in GitHub Discussions
- Open an issue if you found a bug

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in related documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License, the same license as the project.

## Questions?

Don't hesitate to ask! Open an issue with the "question" label or start a discussion. We're here to help and appreciate your interest in contributing!

---

**Thank you for contributing to GitHub Copilot Orchestra!** 🎉
