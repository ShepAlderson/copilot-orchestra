# Framework Integration Guides

This directory contains integration guides for popular frameworks to help you use GitHub Copilot Orchestra effectively with your tech stack.

## Available Integration Guides

### Frontend Frameworks
1. **[React/Next.js](react-nextjs.md)** - Build React applications with Next.js
2. **[Vue.js](vue.md)** - Progressive JavaScript framework integration
3. **[Angular](angular.md)** - Enterprise-scale frontend applications

### Backend Frameworks
4. **[Node.js/Express](nodejs-express.md)** - JavaScript backend development
5. **[Django](django.md)** - Python web framework
6. **[Spring Boot](spring-boot.md)** - Java enterprise applications
7. **[Ruby on Rails](ruby-on-rails.md)** - Full-stack Ruby framework
8. **[ASP.NET Core](aspnet-core.md)** - .NET web applications

### Mobile & Full-Stack
9. **[React Native](react-native.md)** - Cross-platform mobile development
10. **[Flutter](flutter.md)** - Multi-platform app development

## Quick Reference

| Framework | Language | Best For | Agent Model Recommendation |
|-----------|----------|----------|---------------------------|
| React/Next.js | JavaScript/TypeScript | SPAs, SSR web apps | Haiku (fast iterations) |
| Vue.js | JavaScript | Progressive web apps | Haiku (fast iterations) |
| Angular | TypeScript | Enterprise apps | Sonnet (complex structure) |
| Node.js/Express | JavaScript | REST APIs, microservices | Haiku (rapid development) |
| Django | Python | Full-stack web apps | Sonnet (comprehensive) |
| Spring Boot | Java | Enterprise backends | Sonnet (complexity) |
| Ruby on Rails | Ruby | Full-stack apps | Haiku (conventions) |
| ASP.NET Core | C# | Enterprise web apps | Sonnet (comprehensive) |
| React Native | JavaScript | Mobile apps | Haiku (rapid prototyping) |
| Flutter | Dart | Cross-platform apps | Haiku (widget-based) |

## How to Use These Guides

Each integration guide includes:

1. **Setup Instructions** - Configure Orchestra for the framework
2. **Agent Customization** - Framework-specific agent settings
3. **Common Patterns** - Best practices for the framework
4. **Example Workflows** - Real-world scenarios
5. **Testing Strategies** - Framework-specific test approaches
6. **Tips & Tricks** - Optimization and gotchas

## General Integration Tips

### Before Starting

1. **Review framework documentation** - Understand conventions
2. **Set up test infrastructure** - Orchestra enforces TDD
3. **Configure linting** - Ensure code quality
4. **Install dependencies** - Have framework CLI tools ready

### During Development

1. **Be specific in requests** - Mention framework patterns
2. **Reference existing code** - Help planning-subagent find patterns
3. **Keep phases small** - 1-3 components per phase
4. **Test incrementally** - Don't let test suite grow too large

### Framework-Specific Considerations

- **Component-based frameworks** (React, Vue, Angular): One component per phase
- **MVC frameworks** (Django, Rails, Spring): Group model, view, controller together
- **API frameworks** (Express, ASP.NET): One endpoint per phase
- **Mobile frameworks** (React Native, Flutter): One screen/widget per phase

## Contributing New Guides

Have experience with another framework? Contribute a guide!

1. Copy an existing guide as template
2. Add framework-specific details
3. Include real examples
4. Test the workflow yourself
5. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

---

**Need help?** Open an issue or start a discussion!
