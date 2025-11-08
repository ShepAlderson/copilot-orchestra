# Frequently Asked Questions (FAQ)

Quick answers to common questions about GitHub Copilot Orchestra.

## General Questions

### What is GitHub Copilot Orchestra?

GitHub Copilot Orchestra is a multi-agent orchestration system for AI-assisted software development. It coordinates specialized AI agents through a complete development cycle: planning → implementation → review → commit, with a focus on Test-Driven Development (TDD).

### Why use this instead of using GitHub Copilot directly?

The Orchestra system adds structure, quality gates, and TDD enforcement that aren't built into standard Copilot usage. It prevents common AI coding pitfalls like:
- Skipping tests
- Making changes too broad in scope
- Insufficient code review
- Poor commit practices
- Context window overflow

### Is this free to use?

The Orchestra system itself is MIT licensed (free). However, you need:
- A GitHub Copilot subscription (paid)
- VS Code Insiders (free)
- The agents use Copilot's models, so standard Copilot costs/limits apply

### What programming languages does it support?

The system is language-agnostic! It works with any language that:
- Has test infrastructure
- Uses git for version control
- Can be edited in VS Code

Successfully used with: JavaScript/TypeScript, Python, Java, Go, Ruby, C#, PHP, and more.

## Setup and Installation

### Do I need VS Code Insiders or can I use regular VS Code?

Currently, **VS Code Insiders is required**. The custom agent/chat modes feature is only available in the Insiders version.

### How do I know if the agents are installed correctly?

Open GitHub Copilot Chat, click the chat mode dropdown at the bottom. You should see:
- Conductor
- planning-subagent
- implement-subagent
- code-review-subagent

If you don't see them, check the [Troubleshooting Guide](TROUBLESHOOTING.md).

### Can I use this with an existing project?

Yes! The Orchestra works great with existing projects. The planning-subagent will analyze your codebase and follow existing patterns.

### Do I need to commit the agent files to my repository?

You have options:
- **Project-specific**: Keep `.agent.md` files in repo to share with team
- **Global**: Install in User Data directory for personal use across all projects

There's no requirement either way.

### Should I commit the plans/ directory?

It's up to you:
- **Commit them**: Creates audit trail, good for teams
- **Don't commit**: Add `plans/` to `.gitignore` if you prefer
- **Archive old plans**: Move completed plans to `plans/archived/`

## Using the System

### How long does a typical task take?

Depends on complexity:
- **Simple utility function**: 10-20 minutes
- **API endpoint with tests**: 30-60 minutes
- **Feature with multiple components**: 1-3 hours
- **Large feature**: Multiple sessions over hours/days

Time includes planning, implementation, testing, and review.

### Can I pause and resume later?

Yes! The plan files in `plans/` directory serve as checkpoints. You can:
- Review the plan file to see what's been done
- Tell Conductor "Continue from phase X in task-name-plan.md"
- Reference phase completion files for context

### What if I disagree with the plan?

That's what the approval step is for! When Conductor presents a plan:
- Request changes: "Break phase 2 into smaller pieces"
- Add requirements: "Also include input validation"
- Reject and restart: "Let's approach this differently"

You're in control at every mandatory pause point.

### Can I manually edit the code during a phase?

Yes, but with caveats:
- Manual edits won't be reviewed by code-review-subagent automatically
- May cause confusion if agent expects different state
- Best practice: Let phase complete, then make manual adjustments
- Or: Provide specific instructions to the implement-subagent

### What if tests keep failing?

1. **Review test expectations** - Are tests correct?
2. **Check environment** - Dependencies installed? Database seeded?
3. **Manual debugging** - Run tests yourself, check error messages
4. **Simplify** - Ask agent to break down into smaller pieces
5. **Intervene** - Fix manually if agent is stuck

See [Troubleshooting Guide](TROUBLESHOOTING.md) for detailed solutions.

### Can I use this for documentation-only tasks?

Yes! While optimized for code, the Orchestra works for:
- Writing documentation
- Creating examples
- Updating READMEs
- Generating guides

Just adjust your request accordingly.

## Technical Details

### Which AI models are used?

Default configuration:
- **Conductor**: Claude Sonnet 4.5 (planning and orchestration)
- **planning-subagent**: Claude Sonnet 4.5 (research)
- **implement-subagent**: Claude Haiku 4.5 (implementation)
- **code-review-subagent**: Claude Sonnet 4.5 (review)

You can change models by editing the `.agent.md` files.

### Why different models for different agents?

Cost and performance optimization:
- **Sonnet** for complex reasoning (planning, review)
- **Haiku** for straightforward tasks (implementation)

This balances quality with cost-effectiveness.

### How much does it cost to use?

Costs depend on GitHub Copilot pricing model:
- Usage is billed through your Copilot subscription
- Token usage varies by task complexity
- Implementation agent uses cheaper Haiku model
- Typical task: Equivalent to several hours of regular Copilot usage

### Can I use different AI models?

Yes! Available models include:
- Claude Sonnet 4.5, Haiku 4.5, Sonnet 4, Sonnet 3.5
- GPT-5, GPT-5 mini, GPT-4.1, GPT-4o
- Grok Code Fast 1
- Gemini 2.5 Pro

Change the `model:` field in agent frontmatter.

### What about context window limits?

The Orchestra helps manage context:
- Each subagent has its own context window
- Phases keep changes focused
- Commit frequently to reset state
- Start new chat for new tasks
- Plan files serve as compressed context

See [Troubleshooting Guide](TROUBLESHOOTING.md) for context management tips.

### Does this work offline?

No, requires internet connection:
- AI models are cloud-based (via GitHub Copilot)
- Agents make API calls through Copilot service
- Git operations are local, but pushing requires network

## Workflow Questions

### What's the difference between phases in the plan?

Phases are independent units of work:
- Each phase has its own objective
- Self-contained: tests + implementation + review
- Independently committable
- Typically modify 1-3 files
- 5-30 minutes to complete

### Why is TDD enforced?

Test-Driven Development provides:
- **Clear requirements** - Failing tests define success
- **Confidence** - Passing tests verify correctness
- **Regression prevention** - Tests catch future breaks
- **AI guidance** - Tests guide agent implementation
- **Documentation** - Tests show usage examples

### Can I skip the review phase?

Not recommended, but technically you could:
- Modify Conductor agent to skip code-review-subagent
- Manually verify changes yourself
- Be aware: loses quality assurance benefit

### What if the review fails repeatedly?

Several options:
1. **Address feedback** - Fix the issues raised
2. **Manual fix** - Fix problems yourself
3. **Override** - Tell Conductor to proceed anyway (not recommended)
4. **Revise plan** - Break phase into smaller pieces
5. **Adjust standards** - Modify code-review-subagent if too strict

### How do I handle merge conflicts?

Currently manual:
1. Agent will detect conflicts
2. Conductor will notify you
3. You resolve conflicts manually
4. Commit the resolution
5. Tell Conductor to continue

Future: May add merge conflict resolution subagent.

## Customization

### Can I modify the agents?

Absolutely! The `.agent.md` files are meant to be customized:
- Adjust models
- Modify workflow rules
- Add project conventions
- Change phase structure
- Add custom validation

See [Templates](templates/README.md) for examples.

### Can I create my own subagents?

Yes! To add a custom subagent:
1. Create `your-subagent.agent.md`
2. Define its role and instructions
3. Update Conductor to invoke it
4. Test thoroughly

Example use cases:
- Security scanning
- Performance testing
- Documentation generation
- Deployment preparation

### How do I share customizations with my team?

1. **Commit agent files** to repository
2. Team members clone repo
3. Agent files are in project root
4. VS Code Insiders auto-detects them
5. Team uses same workflow

### Can I use this with CI/CD?

The Orchestra is designed for interactive development. For CI/CD:
- Tests written by Orchestra run in CI
- Code quality enforced by review phase
- Commits integrate into standard pipeline
- Plan files can be archived for auditing

## Troubleshooting

### Agent not responding?

Common causes:
- Model temporarily unavailable
- Context window full
- Network issues
- Request too vague

See [Troubleshooting Guide](TROUBLESHOOTING.md) for detailed solutions.

### Subagent invocation fails?

Check:
1. All 4 agent files installed?
2. File names exactly correct?
3. VS Code Insiders restarted?
4. Copilot subscription active?

### Changes not being committed?

Remember:
- You manually commit (Conductor provides message)
- Check git configuration
- Verify working directory state
- Review generated commit message

## Best Practices

### How many phases should a plan have?

General guidelines:
- **Simple tasks**: 2-4 phases
- **Medium tasks**: 4-7 phases
- **Complex tasks**: 7-10 phases
- **Very complex**: Break into multiple plans

If a plan has >10 phases, consider breaking it up.

### How big should each phase be?

Keep phases focused:
- Modify 1-3 files
- 5-30 minutes to complete
- One clear objective
- Independently testable
- Easily reviewable

If a phase seems too big, ask Conductor to break it down.

### Should I run the full test suite every phase?

Recommended approach:
1. Run specific test file first
2. Verify it passes
3. Run full test suite
4. Check for regressions

This catches issues early without wasting time.

### How specific should my initial request be?

More specific is better:
- ✅ "Add JWT auth to my Express API using bcrypt for passwords and PostgreSQL for storage"
- ❌ "Add authentication"

Include:
- Tech stack
- Existing patterns to follow
- Constraints or requirements
- Where files should go

## Contributing and Community

### How can I contribute?

Many ways to help:
- Report bugs or issues
- Suggest improvements
- Contribute examples
- Share agent templates
- Improve documentation
- Answer questions in discussions

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Where do I report bugs?

Open an issue on GitHub:
1. Check existing issues first
2. Use bug report template
3. Include environment details
4. Provide steps to reproduce

### How do I request a feature?

1. Check [IMPROVEMENTS.md](IMPROVEMENTS.md) for planned features
2. Search existing issues/discussions
3. Open a feature request issue
4. Describe use case and benefit

### Is there a community?

Growing! Connect via:
- GitHub Issues
- GitHub Discussions
- Pull Request comments

## Advanced Usage

### Can I chain multiple tasks?

Yes, but start new chat for each major task:
- Prevents context overflow
- Clearer separation
- Easier to track
- Better performance

Reference previous work via plan files if needed.

### Can I use this for refactoring?

Absolutely! Great for refactoring:
- Tests ensure behavior doesn't change
- Small, reviewable changes
- Clear commit history
- Quality gates prevent issues

### Does it work with monorepos?

Yes! Works well with monorepos:
- Planning-subagent analyzes relevant sections
- Focus phases on specific packages
- Follow existing patterns per package

### Can I automate repetitive tasks?

The agents learn patterns from your codebase. For truly repetitive tasks:
- Create a template agent
- Build example into plan template
- Generate from prompts
- Reference previous similar work

---

## Still Have Questions?

- 📖 Check the [README](README.md)
- 🚀 Read the [Quick Start Guide](QUICKSTART.md)
- 🔧 Review [Troubleshooting](TROUBLESHOOTING.md)
- 💬 Ask in [GitHub Discussions](https://github.com/killo431/copilot-orchestra/discussions)
- 🐛 Open an [Issue](https://github.com/killo431/copilot-orchestra/issues)
