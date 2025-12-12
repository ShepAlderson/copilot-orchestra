# Troubleshooting Guide

This guide covers common issues you might encounter while using GitHub Copilot Orchestra and their solutions.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Agent Not Working](#agent-not-working)
- [Workflow Issues](#workflow-issues)
- [Performance Problems](#performance-problems)
- [Git and Commit Issues](#git-and-commit-issues)
- [Test Execution Problems](#test-execution-problems)
- [Context and Token Limits](#context-and-token-limits)
- [Agent Behavior Issues](#agent-behavior-issues)

---

## Installation Issues

### Agent doesn't appear in chat dropdown

**Symptoms:**
- Custom agents not visible in the chat mode selector
- Only default Copilot modes available

**Solutions:**

1. **Verify VS Code Insiders version**
   ```bash
   # Check you're running VS Code Insiders
   code-insiders --version
   ```
   - Download latest from: https://code.visualstudio.com/insiders/

2. **Check agent file location**
   - **Project scope:** Files must be in `.github/agents/` directory (recommended) or project root
   - **Global scope:** Files must be in User Data prompts directory
     - Mac: `~/Library/Application Support/Code - Insiders/User/prompts/`
     - Windows: `%APPDATA%\Code - Insiders\User\prompts\`
     - Linux: `~/.config/Code - Insiders/User/prompts/`
   - **Workspace import:** Use `copilot-orchestra.code-workspace` file for automatic setup

3. **Verify file naming**
   - Files must end with `.agent.md`
   - Names must match exactly:
     - `Conductor.agent.md`
     - `planning-subagent.agent.md`
     - `implement-subagent.agent.md`
     - `code-review-subagent.agent.md`
     - `quality-assurance-subagent.agent.md`

4. **Restart VS Code Insiders**
   - Completely quit and restart (not just reload window)
   - Close all VS Code instances first

5. **Check GitHub Copilot subscription**
   - Verify active subscription in GitHub settings
   - Ensure Copilot Chat extension is installed and enabled
   - Try signing out and back into GitHub in VS Code

### Agent file format errors

**Symptoms:**
- Agent appears but fails to load
- Error messages about YAML frontmatter

**Solutions:**

1. **Validate YAML frontmatter**
   ```yaml
   ---
   description: 'Your description'
   tools: ['tool1', 'tool2']
   model: Claude Sonnet 4.5 (copilot)
   ---
   ```
   - Must have opening and closing `---`
   - Quotes around descriptions and tool names
   - Valid model name from supported list

2. **Check for special characters**
   - Avoid smart quotes (" " instead of " ")
   - Use straight apostrophes (' ')
   - Remove any non-ASCII characters from frontmatter

3. **Verify file encoding**
   - Save files as UTF-8
   - No BOM (Byte Order Mark)

---

## Agent Not Working

### Conductor doesn't respond

**Symptoms:**
- Conductor selected but doesn't reply to requests
- Hangs indefinitely or times out

**Solutions:**

1. **Check request specificity**
   - Provide context about your project
   - Mention tech stack and frameworks
   - Be specific about what you want
   
   ❌ Bad: "Add authentication"
   ✅ Good: "Add JWT authentication to my Express.js API with bcrypt password hashing"

2. **Verify workspace is git repository**
   ```bash
   git status
   # If error, initialize:
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Check model availability**
   - Ensure selected model (Claude Sonnet 4.5) is available
   - Try changing to a different model in agent frontmatter
   - Check GitHub Copilot status

4. **Review chat history length**
   - If chat history is very long, start a new chat
   - Long histories can slow down responses

### Subagent invocation fails

**Symptoms:**
- Error: "Cannot find subagent"
- Subagent doesn't execute when Conductor calls it

**Solutions:**

1. **Verify all agent files installed**
   - Need all 5 files: Conductor + 4 subagents
   - Check in `.github/agents/` directory or project root
   - Check spelling and capitalization exactly match

2. **Check subagent naming**
   - Conductor looks for specific names:
     - `planning-subagent`
     - `implement-subagent`
     - `code-review-subagent`
     - `quality-assurance-subagent`
   - Names are case-sensitive

3. **Restart VS Code**
   - Changes to agent files require restart
   - Quit completely, don't just reload

4. **Try invoking subagent directly**
   - Test if subagent works independently
   - Select it from dropdown and give it a simple task
   - If it works, issue is with Conductor invocation

---

## Workflow Issues

### Plan never gets created

**Symptoms:**
- Conductor acknowledges request but doesn't create plan
- Research phase completes but planning doesn't start

**Solutions:**

1. **Provide more context**
   - Describe your project structure
   - Mention existing files and patterns
   - Attach relevant files using @ mentions

2. **Check plans directory exists**
   ```bash
   mkdir -p plans
   ```

3. **Simplify initial request**
   - Break down complex requests
   - Start with smaller, well-defined tasks
   - Build up to larger features

4. **Review planning-subagent configuration**
   - Ensure it has search and file access tools
   - Check model has enough capacity

### Implementation phase stuck

**Symptoms:**
- implement-subagent starts but never completes
- Repeatedly tries same approach without progress

**Solutions:**

1. **Interrupt and provide guidance**
   - Manually intervene with specific directions
   - Suggest alternative approaches
   - Break phase into smaller sub-tasks

2. **Check test infrastructure**
   ```bash
   # Verify tests can run
   npm test  # or appropriate command
   ```
   - Install missing test dependencies
   - Fix test configuration if needed

3. **Review phase scope**
   - Ask Conductor to break phase into smaller pieces
   - "Please break this phase down into 2-3 smaller phases"
   - Each phase should modify 1-3 files maximum

4. **Check for environment issues**
   - Missing dependencies
   - Configuration files not set up
   - Database connections failing

### Review keeps failing

**Symptoms:**
- code-review-subagent returns NEEDS_REVISION repeatedly
- Same issues mentioned multiple times

**Solutions:**

1. **Review feedback carefully**
   - Address all CRITICAL and MAJOR issues
   - Check if feedback is actionable
   - Ask for clarification if unclear

2. **Manual intervention**
   - Fix issues yourself if agent struggles
   - Commit your fixes
   - Continue to next phase

3. **Adjust review criteria**
   - If feedback is too strict, modify code-review-subagent
   - Add project-specific exceptions
   - Focus on critical issues only

4. **Check if changes actually made**
   ```bash
   git status
   git diff
   ```
   - Verify implement-subagent actually modified files
   - Sometimes agent thinks it changed files but didn't

---

## Performance Problems

### Responses are very slow

**Symptoms:**
- Long wait times between agent responses
- Timeouts during operations

**Solutions:**

1. **Reduce phase complexity**
   - Keep phases focused and small
   - Target 1-3 files per phase
   - Fewer tests per phase initially

2. **Optimize model selection**
   - Use Claude Haiku for implementation (faster, cheaper)
   - Use Claude Sonnet for planning and review (more thorough)
   - Consider GPT models if Claude is slow

3. **Manage context size**
   - Start new chat sessions for new tasks
   - Don't attach too many large files
   - Use semantic search instead of reading entire codebase

4. **Check network connectivity**
   - Ensure stable internet connection
   - Try different network if available
   - Check GitHub Copilot service status

### High token usage / cost concerns

**Symptoms:**
- Rapid token consumption
- Worried about costs

**Solutions:**

1. **Optimize model selection**
   ```yaml
   # In implement-subagent.agent.md
   model: Claude Haiku 4.5 (copilot)  # Most cost-effective
   ```

2. **Reduce context in prompts**
   - Provide only necessary information
   - Don't attach entire large files
   - Use excerpts and summaries

3. **Batch operations**
   - Group related changes in same phase
   - Fewer, larger phases instead of many tiny ones
   - Balance between phase size and iteration speed

4. **Monitor usage**
   - Track phases completed vs tokens used
   - Identify inefficient patterns
   - Adjust workflow accordingly

---

## Git and Commit Issues

### Can't commit changes

**Symptoms:**
- Commit command fails
- Working directory not clean

**Solutions:**

1. **Verify git configuration**
   ```bash
   git config user.name
   git config user.email
   
   # If not set:
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

2. **Check for uncommitted files**
   ```bash
   git status
   git add .
   git commit -m "Your message"
   ```

3. **Review generated commit message**
   - Copy from Conductor's output
   - Paste into terminal for commit
   - Or use git GUI if preferred

4. **Handle merge conflicts**
   - If conflicts exist, resolve manually
   - Stage resolved files
   - Complete commit

### Plans directory files keep getting committed

**Symptoms:**
- Don't want plans/ directory in git history
- Files automatically staged

**Solutions:**

1. **Add to .gitignore**
   ```bash
   echo "plans/" >> .gitignore
   git add .gitignore
   git commit -m "Add plans directory to gitignore"
   ```

2. **Remove already tracked files**
   ```bash
   git rm -r --cached plans/
   git commit -m "Remove plans directory from git tracking"
   ```

3. **Keep specific plan files**
   ```
   # In .gitignore
   plans/*
   !plans/.gitkeep
   !plans/important-plan.md
   ```

---

## Test Execution Problems

### Tests won't run

**Symptoms:**
- Test commands fail
- implement-subagent can't verify tests

**Solutions:**

1. **Install test dependencies**
   ```bash
   # Node.js
   npm install
   
   # Python
   pip install -r requirements.txt
   
   # Other environments
   # Follow your project's setup instructions
   ```

2. **Verify test command**
   ```bash
   # Try running tests manually
   npm test
   pytest
   mvn test
   # etc.
   ```

3. **Check test file locations**
   - Tests in correct directories?
   - Following project conventions?
   - Test files properly named?

4. **Review test framework setup**
   - Configuration files present?
   - Test runner installed?
   - Environment variables set?

### Tests fail after implementation

**Symptoms:**
- implement-subagent writes tests that fail
- Can't get tests to pass

**Solutions:**

1. **Review test expectations**
   - Are tests correct?
   - Do they match requirements?
   - Are assertions reasonable?

2. **Check test environment**
   - Database seeded with test data?
   - Mock services configured?
   - Environment variables set?

3. **Manual debugging**
   - Run tests manually with verbose output
   - Check error messages carefully
   - Fix issues one at a time

4. **Simplify tests**
   - Ask agent to simplify test cases
   - Start with happy path only
   - Add edge cases later

---

## Context and Token Limits

### "Context window full" error

**Symptoms:**
- Agent stops responding
- Error about context limits

**Solutions:**

1. **Start new chat session**
   - Open new Copilot Chat window
   - Reselect Conductor agent
   - Continue where you left off

2. **Reference existing plans**
   - Tell Conductor: "Continue from phase X in task-name-plan.md"
   - Attach only relevant plan files
   - Don't need to repeat entire history

3. **Reduce phase size**
   - Break down large phases
   - Process one component at a time
   - Commit more frequently

4. **Clean up chat history**
   - Remove old messages not needed
   - Summarize previous work instead of full history

### Agent forgets previous context

**Symptoms:**
- Doesn't remember earlier decisions
- Asks for already-provided information

**Solutions:**

1. **Reference plan documents**
   - Plans are saved in `plans/` directory
   - Point agent to these files
   - Use @ to attach relevant documents

2. **Provide quick summary**
   - Briefly recap what's been done
   - State current phase and objective
   - Mention key decisions made

3. **Use phase completion files**
   - Review what was completed
   - Continue from clear checkpoint
   - Reference specific phase files

---

## Agent Behavior Issues

### Agent not following TDD

**Symptoms:**
- Code written before tests
- Tests not failing first
- Minimal code principle violated

**Solutions:**

1. **Reinforce TDD in prompt**
   - "Please follow strict TDD: tests first, see them fail, then implement"
   - Emphasize in each phase instruction
   - Review and correct when violated

2. **Check implement-subagent configuration**
   - Verify TDD instructions in agent file
   - Ensure workflow section is clear
   - Add more explicit TDD steps if needed

3. **Manual verification**
   - Review git changes to verify order
   - Check that tests exist and are meaningful
   - Verify tests actually test the implementation

### Agent makes too many changes

**Symptoms:**
- Phases modify many files
- Changes beyond scope of phase
- Refactoring unrelated code

**Solutions:**

1. **Be more specific in phase definitions**
   - Explicitly list files to modify
   - State what NOT to change
   - Set clear boundaries

2. **Review changes before committing**
   ```bash
   git diff
   ```
   - Verify only expected files changed
   - Check for unintended modifications
   - Revert unnecessary changes

3. **Adjust phase scope**
   - Ask Conductor to narrow focus
   - One feature/file at a time
   - Defer refactoring to separate phase

### Wrong model being used

**Symptoms:**
- Responses don't match expected model capabilities
- Higher/lower quality than expected
- Cost different than planned

**Solutions:**

1. **Check agent frontmatter**
   ```yaml
   ---
   model: Claude Sonnet 4.5 (copilot)
   ---
   ```

2. **Verify model availability**
   - Some models may not be available in your region
   - Check GitHub Copilot settings
   - Try alternative models

3. **Update model selection**
   - Edit `.agent.md` files
   - Choose from available models list
   - Restart VS Code after changes

---

## Getting Additional Help

If you've tried these solutions and still have issues:

1. **Check GitHub Issues**
   - Search existing issues: https://github.com/killo431/copilot-orchestra/issues
   - Someone may have encountered same problem

2. **Review documentation**
   - README.md - Full documentation
   - QUICKSTART.md - Setup guide
   - IMPROVEMENTS.md - Upcoming features

3. **Open a new issue**
   - Provide detailed description
   - Include error messages
   - Share agent configurations (remove sensitive data)
   - Describe steps to reproduce

4. **Community discussions**
   - GitHub Discussions for questions
   - Share your use case
   - Learn from others' experiences

---

## Prevention Tips

### Best practices to avoid issues:

✅ **DO:**
- Commit after every phase
- Keep phases small and focused
- Review plans before starting
- Provide specific requests with context
- Test manually if automated tests fail
- Start new chat sessions for new tasks
- Monitor token usage
- Read error messages carefully

❌ **DON'T:**
- Skip commit steps
- Make phases too large
- Blindly accept generated plans
- Give vague requests without context
- Ignore test failures
- Reuse chat sessions indefinitely
- Attach unnecessary files
- Ignore warnings from agents

---

**Still stuck? Open an issue and we'll help!**
