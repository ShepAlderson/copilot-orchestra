# GitHub Copilot Orchestra - Quick Start Guide

⚡ **Get up and running with the Conductor agent in 5 minutes**

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] VS Code Insiders installed ([Download here](https://code.visualstudio.com/insiders/))
- [ ] GitHub Copilot subscription (Individual or Business)
- [ ] Git installed and configured
- [ ] A git repository to work in

## 3-Step Setup

### Step 1: Install Agent Files (2 minutes)

**Option A: Quick Install (Copy to Project)**
```bash
# Clone the repository
git clone https://github.com/killo431/copilot-orchestra.git

# Copy agent files to your project
cp copilot-orchestra/*.agent.md /path/to/your/project/
```

**Option B: Global Install (Use in All Projects)**

1. Open VS Code Insiders
2. Click the chat mode dropdown in Copilot Chat
3. Select "Configure Custom Agents"
4. Choose "User Data" location
5. Create each agent file and paste content from:
   - `Conductor.agent.md`
   - `planning-subagent.agent.md`
   - `implement-subagent.agent.md`
   - `code-review-subagent.agent.md`

### Step 2: Create Plans Directory (30 seconds)

```bash
cd /path/to/your/project
mkdir plans
```

### Step 3: Start the Conductor (30 seconds)

1. Open GitHub Copilot Chat in VS Code Insiders
2. Click the agent dropdown at the bottom
3. Select **"Conductor"**
4. You're ready to go! 🎉

## Your First Task (2 minutes)

Let's try a simple example to see the workflow in action:

### Example Request:
```
Create a utility function to validate email addresses with tests.
```

### What Happens Next:

**1. Planning Phase** 🎯
- Conductor delegates to planning-subagent to research your codebase
- Creates a multi-phase plan
- **YOU REVIEW AND APPROVE** the plan

**2. Implementation** 💻
- implement-subagent writes failing tests first
- Implements minimal code to pass tests
- Verifies tests pass

**3. Review** 🔍
- code-review-subagent reviews the changes
- Returns APPROVED/NEEDS_REVISION/FAILED
- Revises if needed

**4. Commit** ✅
- Conductor presents summary and commit message
- **YOU MAKE THE GIT COMMIT**
- **YOU CONFIRM** to proceed to next phase

**Repeat steps 2-4 for each phase until complete!**

## Workflow Diagram

```
┌─────────────────────────────────────────────────────┐
│  YOU: Request a feature                             │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  CONDUCTOR: Delegates to planning-subagent          │
│  Creates multi-phase plan                           │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  YOU: Review and approve plan                       │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════╗  │
│  ║  FOR EACH PHASE:                              ║  │
│  ║                                               ║  │
│  ║  1. implement-subagent: Write tests + code    ║  │
│  ║  2. code-review-subagent: Review changes      ║  │
│  ║  3. CONDUCTOR: Present summary                ║  │
│  ║  4. YOU: Commit and confirm next phase        ║  │
│  ╚═══════════════════════════════════════════════╝  │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  CONDUCTOR: Generate completion report              │
│  Task complete! 🎉                                  │
└─────────────────────────────────────────────────────┘
```

## Key Commands

While interacting with the Conductor:

- **"Proceed"** or **"Continue"** - Move to next phase after commit
- **"Revise the plan"** - Request changes to the plan
- **"Break this phase down"** - Split a phase into smaller pieces
- **"Skip to next phase"** - Move forward without implementing current phase
- **"Show me the plan"** - Review the current plan
- **"What's the status?"** - Get current progress update

## Critical Points to Remember

### 🛑 Mandatory Stop Points

The Conductor will ALWAYS stop and wait for your input at:

1. **After presenting the plan** - Before any code is written
2. **After each phase is reviewed** - Before moving to next phase
3. **After plan completion** - Final summary

**Don't worry, you're always in control!**

### 💡 Best Practices

1. **Be Specific in Requests**
   - ✅ Good: "Add JWT auth to my Express API using PostgreSQL"
   - ❌ Vague: "Add authentication"

2. **Review Plans Carefully**
   - Check phase breakdown makes sense
   - Answer any open questions
   - Request changes if needed

3. **Commit After Each Phase**
   - Don't skip commits!
   - Each phase is independently committable
   - Creates clear development history

4. **Keep Phases Small**
   - If a phase seems too large, ask to break it down
   - Smaller phases = faster iterations
   - Target 1-3 files per phase

## Generated Files

The Conductor creates documentation in `plans/`:

```
plans/
├── my-task-plan.md                    # The approved plan
├── my-task-phase-1-complete.md        # Phase 1 summary
├── my-task-phase-2-complete.md        # Phase 2 summary
└── my-task-complete.md                # Final completion report
```

**Tip:** You can add `plans/` to `.gitignore` if you don't want to commit these files.

## Troubleshooting Quick Fixes

### Agent not showing in dropdown?
- Restart VS Code Insiders
- Check agent files are in correct location
- Verify GitHub Copilot Chat is enabled

### Subagent fails to invoke?
- Make sure all 4 agent files are installed
- Check file names match exactly (case-sensitive)
- Restart VS Code Insiders

### Tests not running?
- Verify your project has test infrastructure
- Check test commands in your project
- May need to install dependencies first

### Context window full?
- Break down phases into smaller pieces
- Commit more frequently
- Start a new chat session

## Next Steps

### Learn More
- 📖 Read the [full README](README.md) for detailed documentation
- 🔧 Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- 💡 See [IMPROVEMENTS.md](IMPROVEMENTS.md) for upcoming features

### Try Real Examples
Work through realistic scenarios:
- Add a REST API endpoint
- Implement form validation
- Create a CLI command
- Add database migration

### Customize the Agents
- Adjust AI models in `.agent.md` files
- Modify workflow rules to fit your team
- Add project-specific conventions

## Support

- 🐛 Report issues: [GitHub Issues](https://github.com/killo431/copilot-orchestra/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/killo431/copilot-orchestra/discussions)
- 📧 Questions: Open an issue with the "question" label

---

**Ready to build with AI assistance? Start the Conductor and make your first request!** 🚀
