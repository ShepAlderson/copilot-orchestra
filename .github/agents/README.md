# GitHub Copilot Orchestra Agents

This directory contains the custom agent definitions for the GitHub Copilot Orchestra system.

## Agent Files

### Core Agents

- **Conductor.agent.md** - Main orchestration agent that manages the complete development cycle
- **planning-subagent.agent.md** - Research and context gathering specialist
- **implement-subagent.agent.md** - Implementation specialist following TDD conventions
- **code-review-subagent.agent.md** - Code review specialist
- **quality-assurance-subagent.agent.md** - Quality assurance and security specialist

## Usage

### Option 1: Import Workspace (Recommended)

Open the workspace file in VS Code Insiders:

```bash
cd copilot-orchestra
code-insiders copilot-orchestra.code-workspace
```

The workspace automatically configures all agents, settings, and extensions.

### Option 2: Copy to Your Project

Copy the entire `.github/agents/` directory to your project:

```bash
cp -r copilot-orchestra/.github/agents /path/to/your/project/.github/
```

VS Code Insiders will automatically detect and load the agents.

### Option 3: Install Globally

Install agents in your VS Code Insiders User Data directory to use across all projects:

**macOS/Linux:**
```bash
cp *.agent.md ~/Library/Application\ Support/Code\ -\ Insiders/User/prompts/
```

**Windows:**
```powershell
Copy-Item *.agent.md "$env:APPDATA\Code - Insiders\User\prompts\"
```

Or manually through VS Code Insiders:
1. Open GitHub Copilot Chat
2. Click the chat mode dropdown
3. Select "Configure Custom Agents"
4. Create each agent and paste the content from these files

## How It Works

Each `.agent.md` file defines:
- Agent name and description (in YAML frontmatter)
- Specialized instructions and workflows
- AI model to use (Claude Sonnet 4.5 or Haiku 4.5)
- Integration with other agents

The Conductor agent orchestrates the workflow by invoking subagents as needed:
```
Planning → Implementation → Code Review → Quality Assurance → Commit
```

## Documentation

- **[Quick Start Guide](../../QUICKSTART.md)** - Get started in 5 minutes
- **[Full README](../../README.md)** - Complete documentation
- **[Architecture](../../ARCHITECTURE.md)** - System design and workflows
- **[Quality Gates](../../docs/QUALITY-GATES.md)** - QA system documentation

## Support

- 🐛 [Report Issues](https://github.com/killo431/copilot-orchestra/issues)
- 💬 [Discussions](https://github.com/killo431/copilot-orchestra/discussions)
- 📖 [FAQ](../../FAQ.md)
