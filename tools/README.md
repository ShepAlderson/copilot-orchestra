# GitHub Copilot Orchestra - Tools

This directory contains fully working tools to enhance your Orchestra workflow.

## Available Tools

### 1. 🎨 Blueprint Generator (`blueprint-generator.js`)

Automatically generates project architecture diagrams by analyzing your codebase.

**Features:**
- Analyzes file structure and dependencies
- Detects architectural patterns (frontend, backend, database, testing)
- Generates comprehensive markdown documentation
- Identifies missing components and provides recommendations

**Usage:**
```bash
# Generate blueprint with defaults
node tools/blueprint-generator.js

# Custom output file
node tools/blueprint-generator.js --output ARCHITECTURE.md

# Deep analysis
node tools/blueprint-generator.js --depth deep

# View help
node tools/blueprint-generator.js --help
```

**Output:**
Creates `PROJECT-BLUEPRINT.md` with:
- Project overview
- System architecture diagram
- File structure tree
- Dependencies list
- Detected patterns
- Data flow diagram
- Recommendations

**Example Output:**
```
# MyProject - System Blueprint

## Project Overview
**Project Name:** MyProject
**Type:** Node.js/JavaScript
**Patterns Detected:** 8 architectural patterns

## System Architecture
┌──────────────────────────┐
│   Frontend Layer         │
│   Component-based UI     │
└──────────────────────────┘
           ↓
┌──────────────────────────┐
│   Backend Layer          │
│   REST API               │
└──────────────────────────┘
```

### 2. 🔧 Error Recovery System (`error-recovery.js`)

Comprehensive error detection and automated fixing tool.

**Features:**
- Scans for common setup issues
- Detects missing configuration
- Validates agent files
- Checks test infrastructure
- Verifies dependencies
- Provides automated fixes

**Usage:**
```bash
# Interactive mode (recommended)
node tools/error-recovery.js

# Scan only (no fixes)
node tools/error-recovery.js --scan

# Auto-fix all issues
node tools/error-recovery.js --auto

# Check specific category
node tools/error-recovery.js --category git

# Verbose output
node tools/error-recovery.js --verbose

# View help
node tools/error-recovery.js --help
```

**Categories:**
- `git` - Git initialization and configuration
- `agents` - Agent file validation
- `tests` - Testing framework setup
- `deps` - Dependency management
- `all` - Check everything (default)

**Example Session:**
```
🔍 GitHub Copilot Orchestra - Error Recovery System

Scanning project...

⚠️  Found 3 issue(s):

1. [HIGH] Missing agent files (2)
   Required agent files not found: planning-subagent.agent.md, code-review-subagent.agent.md

2. [MEDIUM] No test script defined
   package.json missing "test" script.

3. [INFO] Plans directory not found
   Orchestra creates documentation in plans/ directory.

3 issue(s) can be fixed automatically.

Fix "No test script defined"? (y/n): y
Fixing: No test script defined...
✅ Fixed: No test script defined
```

### 3. 🧙 Setup Wizard (`setup-wizard.js`)

Interactive setup wizard that guides you through Orchestra installation.

**Features:**
- Detects project type automatically
- Checks prerequisites (VS Code Insiders, Git, etc.)
- Sets up directories and configuration
- Installs testing framework
- Creates documentation
- Generates project blueprint
- Runs error recovery scan

**Usage:**
```bash
# Run the interactive wizard
node tools/setup-wizard.js
```

**What It Does:**

**Step 1: Detect Project Type**
- Automatically identifies Node.js, Python, Java, Ruby, etc.
- Adapts setup based on detected type

**Step 2: Check Prerequisites**
- Verifies VS Code Insiders installation
- Checks Git availability
- Validates Node.js (for tools)

**Step 3: Project Configuration**
- Collects project name and description
- Sets up basic project metadata

**Step 4: Setup Agent Files**
- Guides through agent installation options
- Provides instructions for manual setup
- Supports both local and global installation

**Step 5: Create Directories**
- Creates `plans/` directory
- Optionally creates `src/` and `tests/`
- Sets up `.gitkeep` files

**Step 6: Testing Setup**
- Installs Jest (Node.js) or pytest (Python)
- Configures test scripts
- Sets up test directory structure

**Step 7: Git Configuration**
- Initializes git repository
- Creates `.gitignore` with sensible defaults
- Configures git user if needed

**Step 8: Documentation**
- Creates README.md with Orchestra instructions
- Generates project blueprint
- Sets up documentation structure

**Example Session:**
```
╔═══════════════════════════════════════════════════════════════════╗
║     GitHub Copilot Orchestra - Interactive Setup Wizard          ║
╚═══════════════════════════════════════════════════════════════════╝

📊 Step 1/8: Detecting project type...
✅ Detected: Node.js

🔍 Step 2/8: Checking prerequisites...
✅ VS Code Insiders: found
✅ Git: found
✅ Node.js: found

⚙️  Step 3/8: Project configuration...
Project name (my-app): my-app
Project description: My awesome application

...

╔═══════════════════════════════════════════════════════════════════╗
║                    ✅ Setup Complete!                            ║
╚═══════════════════════════════════════════════════════════════════╝
```

## Installation

The tools are written in Node.js and should work on any system with Node.js installed.

**Prerequisites:**
- Node.js 14+ (for running tools)
- Git (for some features)

**No installation needed!** Just run the tools directly from this directory.

## Common Workflows

### Setting Up a New Project

```bash
# 1. Run the setup wizard
node tools/setup-wizard.js

# 2. Follow the prompts

# 3. You're ready to use Orchestra!
```

### Diagnosing Issues

```bash
# 1. Run error recovery scan
node tools/error-recovery.js --scan

# 2. Review issues

# 3. Apply fixes
node tools/error-recovery.js --auto
```

### Documenting Your Project

```bash
# Generate architecture blueprint
node tools/blueprint-generator.js

# Review PROJECT-BLUEPRINT.md
# Share with team or include in documentation
```

### Quick Health Check

```bash
# One-liner to check project health
node tools/error-recovery.js --scan --verbose
```

## Making Scripts Executable (Optional)

On Unix-like systems (Mac, Linux), you can make scripts executable:

```bash
chmod +x tools/*.js
```

Then run without `node`:
```bash
./tools/setup-wizard.js
./tools/error-recovery.js --scan
./tools/blueprint-generator.js
```

## Integration with Orchestra

These tools work alongside the Orchestra agent system:

**Before Starting:**
- Run `setup-wizard.js` to configure your project
- Run `error-recovery.js` to ensure everything is working

**During Development:**
- Generate blueprints to document architecture decisions
- Run error recovery if you encounter issues

**After Completion:**
- Generate final blueprint for documentation
- Run error recovery to ensure clean state

## Troubleshooting

### "Cannot find module" error

Make sure you're running from the project root:
```bash
node tools/blueprint-generator.js
```

Not from inside the tools directory.

### Permission denied

On Unix systems:
```bash
chmod +x tools/*.js
```

### Node.js not found

Install Node.js from https://nodejs.org/

## Advanced Usage

### Automating with Scripts

Create a `package.json` script:
```json
{
  "scripts": {
    "setup": "node tools/setup-wizard.js",
    "check": "node tools/error-recovery.js --scan",
    "fix": "node tools/error-recovery.js --auto",
    "blueprint": "node tools/blueprint-generator.js"
  }
}
```

Then use:
```bash
npm run setup
npm run check
npm run fix
npm run blueprint
```

### CI/CD Integration

Use error recovery in CI:
```yaml
# .github/workflows/check.yml
- name: Check Project Health
  run: node tools/error-recovery.js --scan --category tests
```

### Custom Extensions

All tools export their classes, so you can extend them:

```javascript
const BlueprintGenerator = require('./tools/blueprint-generator.js');

class CustomGenerator extends BlueprintGenerator {
  // Add custom functionality
}
```

## Contributing

Found a bug or want to add a feature?

1. Open an issue describing the problem/feature
2. Submit a pull request with your changes
3. Ensure tools still work with existing projects

## License

MIT - Same as GitHub Copilot Orchestra

---

**Need Help?** Open an issue or check the main [README](../README.md)
