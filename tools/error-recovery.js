#!/usr/bin/env node

/**
 * ERROR Recovery System
 * 
 * Comprehensive error recovery tool for GitHub Copilot Orchestra.
 * Detects common issues and provides automated fixes.
 * 
 * Usage:
 *   node tools/error-recovery.js [options]
 *   
 * Options:
 *   --scan, -s        Scan for issues only (no fixes)
 *   --auto, -a        Automatically fix issues without prompting
 *   --category, -c    Check specific category: git, agents, tests, deps
 *   --verbose, -v     Show detailed diagnostics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class ErrorRecoverySystem {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.autoFix = options.auto || false;
    this.scanOnly = options.scan || false;
    this.verbose = options.verbose || false;
    this.category = options.category || 'all';
    
    this.issues = [];
    this.fixes = [];
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    console.log('🔍 GitHub Copilot Orchestra - Error Recovery System\n');
    
    await this.scanForIssues();
    
    if (this.issues.length === 0) {
      console.log('✅ No issues detected! Your project is in good shape.\n');
      this.rl.close();
      return;
    }
    
    console.log(`\n⚠️  Found ${this.issues.length} issue(s):\n`);
    this.issues.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title}`);
      console.log(`   ${issue.description}`);
      if (this.verbose) {
        console.log(`   Location: ${issue.location || 'N/A'}`);
      }
      console.log('');
    });
    
    if (this.scanOnly) {
      console.log('Scan complete. Use without --scan flag to apply fixes.\n');
      this.rl.close();
      return;
    }
    
    await this.applyFixes();
    
    console.log('\n✅ Recovery complete!\n');
    this.rl.close();
  }

  async scanForIssues() {
    console.log('Scanning project...\n');
    
    if (this.category === 'all' || this.category === 'git') {
      this.checkGitIssues();
    }
    
    if (this.category === 'all' || this.category === 'agents') {
      this.checkAgentFiles();
    }
    
    if (this.category === 'all' || this.category === 'tests') {
      this.checkTestSetup();
    }
    
    if (this.category === 'all' || this.category === 'deps') {
      this.checkDependencies();
    }
    
    if (this.category === 'all') {
      this.checkProjectStructure();
      this.checkPlansDirectory();
    }
  }

  checkGitIssues() {
    // Check if git is initialized
    if (!fs.existsSync(path.join(this.rootDir, '.git'))) {
      this.issues.push({
        id: 'git_not_initialized',
        severity: 'high',
        title: 'Git not initialized',
        description: 'Orchestra requires git for version control.',
        location: this.rootDir,
        fixable: true,
        fix: () => this.fixGitInit()
      });
    }
    
    // Check git config
    try {
      execSync('git config user.name', { cwd: this.rootDir, stdio: 'pipe' });
      execSync('git config user.email', { cwd: this.rootDir, stdio: 'pipe' });
    } catch (e) {
      this.issues.push({
        id: 'git_config_missing',
        severity: 'medium',
        title: 'Git configuration incomplete',
        description: 'Git user name or email not configured.',
        fixable: true,
        fix: () => this.fixGitConfig()
      });
    }
    
    // Check for uncommitted changes
    try {
      const status = execSync('git status --porcelain', { 
        cwd: this.rootDir, 
        encoding: 'utf8' 
      });
      if (status.trim()) {
        this.issues.push({
          id: 'uncommitted_changes',
          severity: 'info',
          title: 'Uncommitted changes detected',
          description: 'You have uncommitted changes. Consider committing before starting new work.',
          fixable: false
        });
      }
    } catch (e) {
      // Git not initialized or other error
    }
  }

  checkAgentFiles() {
    const agentFiles = [
      'Conductor.agent.md',
      'planning-subagent.agent.md',
      'implement-subagent.agent.md',
      'code-review-subagent.agent.md',
      'quality-assurance-subagent.agent.md'
    ];
    
    const agentsDir = path.join(this.rootDir, '.github', 'agents');
    const missing = agentFiles.filter(file => 
      !fs.existsSync(path.join(agentsDir, file))
    );
    
    if (missing.length > 0) {
      this.issues.push({
        id: 'missing_agent_files',
        severity: 'high',
        title: `Missing agent files (${missing.length})`,
        description: `Required agent files not found in .github/agents/: ${missing.join(', ')}`,
        fixable: true,
        fix: () => this.fixMissingAgents(missing)
      });
    }
    
    // Validate agent file format
    agentFiles.forEach(file => {
      const filePath = path.join(agentsDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.startsWith('---')) {
          this.issues.push({
            id: `invalid_agent_${file}`,
            severity: 'medium',
            title: `Invalid agent file: ${file}`,
            description: 'Agent file missing YAML frontmatter.',
            location: filePath,
            fixable: false
          });
        }
      }
    });
  }

  checkTestSetup() {
    const packageJsonPath = path.join(this.rootDir, 'package.json');
    const pytestPath = path.join(this.rootDir, 'pytest.ini');
    const pomPath = path.join(this.rootDir, 'pom.xml');
    
    let hasTestSetup = false;
    
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!pkg.scripts || !pkg.scripts.test) {
        this.issues.push({
          id: 'no_test_script',
          severity: 'medium',
          title: 'No test script defined',
          description: 'package.json missing "test" script.',
          fixable: true,
          fix: () => this.fixTestScript()
        });
      } else {
        hasTestSetup = true;
      }
      
      // Check for testing frameworks
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const hasTestFramework = Object.keys(deps).some(dep => 
        ['jest', 'mocha', 'vitest', 'ava', 'tape'].includes(dep)
      );
      
      if (!hasTestFramework) {
        this.issues.push({
          id: 'no_test_framework',
          severity: 'high',
          title: 'No testing framework installed',
          description: 'Orchestra requires a testing framework (Jest, Vitest, etc.).',
          fixable: true,
          fix: () => this.fixTestFramework()
        });
      }
    } else if (fs.existsSync(pytestPath)) {
      hasTestSetup = true;
    } else if (fs.existsSync(pomPath)) {
      hasTestSetup = true;
    }
    
    if (!hasTestSetup && !fs.existsSync(packageJsonPath) && !fs.existsSync(pytestPath)) {
      this.issues.push({
        id: 'no_test_setup',
        severity: 'high',
        title: 'No test setup detected',
        description: 'Orchestra requires test infrastructure for TDD.',
        fixable: false
      });
    }
  }

  checkDependencies() {
    const packageJsonPath = path.join(this.rootDir, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check if node_modules exists
      if (!fs.existsSync(path.join(this.rootDir, 'node_modules'))) {
        this.issues.push({
          id: 'dependencies_not_installed',
          severity: 'high',
          title: 'Dependencies not installed',
          description: 'node_modules directory not found. Run npm install.',
          fixable: true,
          fix: () => this.fixDependencies()
        });
      }
    }
  }

  checkProjectStructure() {
    // Check for README
    if (!fs.existsSync(path.join(this.rootDir, 'README.md'))) {
      this.issues.push({
        id: 'no_readme',
        severity: 'low',
        title: 'No README.md',
        description: 'Project lacks documentation.',
        fixable: true,
        fix: () => this.fixReadme()
      });
    }
    
    // Check for .gitignore
    if (!fs.existsSync(path.join(this.rootDir, '.gitignore'))) {
      this.issues.push({
        id: 'no_gitignore',
        severity: 'medium',
        title: 'No .gitignore file',
        description: 'Missing .gitignore may cause unwanted files to be committed.',
        fixable: true,
        fix: () => this.fixGitignore()
      });
    }
  }

  checkPlansDirectory() {
    const plansDir = path.join(this.rootDir, 'plans');
    
    if (!fs.existsSync(plansDir)) {
      this.issues.push({
        id: 'no_plans_directory',
        severity: 'info',
        title: 'Plans directory not found',
        description: 'Orchestra creates documentation in plans/ directory.',
        fixable: true,
        fix: () => this.fixPlansDirectory()
      });
    }
  }

  async applyFixes() {
    const fixableIssues = this.issues.filter(issue => issue.fixable);
    
    if (fixableIssues.length === 0) {
      console.log('No automatic fixes available for detected issues.\n');
      return;
    }
    
    console.log(`\n${fixableIssues.length} issue(s) can be fixed automatically.\n`);
    
    for (const issue of fixableIssues) {
      let shouldFix = this.autoFix;
      
      if (!this.autoFix) {
        const answer = await this.prompt(
          `Fix "${issue.title}"? (y/n): `
        );
        shouldFix = answer.toLowerCase() === 'y';
      }
      
      if (shouldFix) {
        try {
          console.log(`Fixing: ${issue.title}...`);
          await issue.fix();
          console.log(`✅ Fixed: ${issue.title}\n`);
          this.fixes.push(issue.id);
        } catch (error) {
          console.log(`❌ Failed to fix: ${error.message}\n`);
        }
      } else {
        console.log(`⏭️  Skipped: ${issue.title}\n`);
      }
    }
  }

  // Fix implementations
  async fixGitInit() {
    execSync('git init', { cwd: this.rootDir });
    execSync('git add .', { cwd: this.rootDir });
  }

  async fixGitConfig() {
    console.log('\nGit configuration needed:');
    const name = await this.prompt('Enter your name: ');
    const email = await this.prompt('Enter your email: ');
    
    execSync(`git config user.name "${name}"`, { cwd: this.rootDir });
    execSync(`git config user.email "${email}"`, { cwd: this.rootDir });
  }

  async fixMissingAgents(missing) {
    console.log('\nAgent files are missing. These should be copied from the Orchestra repository.');
    console.log('Visit: https://github.com/killo431/copilot-orchestra');
    console.log('\nYou can:');
    console.log('1. Clone the repository and copy .github/agents/ directory');
    console.log('2. Install agents globally in VS Code Insiders User Data directory');
  }

  async fixTestScript() {
    const packageJsonPath = path.join(this.rootDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!pkg.scripts) {
      pkg.scripts = {};
    }
    
    pkg.scripts.test = 'echo "Error: no test specified" && exit 1';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
  }

  async fixTestFramework() {
    console.log('\nInstalling Jest testing framework...');
    try {
      execSync('npm install --save-dev jest', { 
        cwd: this.rootDir, 
        stdio: 'inherit' 
      });
      
      // Update test script
      const packageJsonPath = path.join(this.rootDir, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      pkg.scripts.test = 'jest';
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    } catch (e) {
      throw new Error('Failed to install Jest. Run manually: npm install --save-dev jest');
    }
  }

  async fixDependencies() {
    console.log('\nInstalling dependencies...');
    try {
      execSync('npm install', { cwd: this.rootDir, stdio: 'inherit' });
    } catch (e) {
      throw new Error('Failed to install dependencies');
    }
  }

  async fixReadme() {
    const projectName = path.basename(this.rootDir);
    const content = `# ${projectName}

Project description goes here.

## Setup

\`\`\`bash
npm install
\`\`\`

## Usage

Describe how to use this project.

## Testing

\`\`\`bash
npm test
\`\`\`

## License

MIT
`;
    fs.writeFileSync(path.join(this.rootDir, 'README.md'), content);
  }

  async fixGitignore() {
    const content = `# Dependencies
node_modules/
venv/
env/

# Build outputs
dist/
build/
*.egg-info/

# Test coverage
coverage/
.nyc_output/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Orchestra plans (optional - uncomment to exclude)
# plans/

# Logs
*.log
npm-debug.log*
`;
    fs.writeFileSync(path.join(this.rootDir, '.gitignore'), content);
  }

  async fixPlansDirectory() {
    const plansDir = path.join(this.rootDir, 'plans');
    fs.mkdirSync(plansDir, { recursive: true });
    
    // Create .gitkeep
    fs.writeFileSync(path.join(plansDir, '.gitkeep'), '');
  }

  prompt(question) {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--scan' || arg === '-s') {
      options.scan = true;
    } else if (arg === '--auto' || arg === '-a') {
      options.auto = true;
    } else if (arg === '--category' || arg === '-c') {
      options.category = args[++i];
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
GitHub Copilot Orchestra - Error Recovery System

Usage: node tools/error-recovery.js [options]

Options:
  --scan, -s        Scan for issues only (no fixes)
  --auto, -a        Automatically fix issues without prompting
  --category, -c    Check specific category: git, agents, tests, deps, all
  --verbose, -v     Show detailed diagnostics
  --help, -h        Show this help message

Examples:
  node tools/error-recovery.js                    # Interactive mode
  node tools/error-recovery.js --scan             # Scan only
  node tools/error-recovery.js --auto             # Auto-fix all
  node tools/error-recovery.js --category git     # Check git only
      `);
      process.exit(0);
    }
  }
  
  const recovery = new ErrorRecoverySystem(options);
  recovery.run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}

module.exports = ErrorRecoverySystem;
