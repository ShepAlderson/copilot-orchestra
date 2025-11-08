#!/usr/bin/env node

/**
 * Setup Wizard
 * 
 * Interactive setup wizard for GitHub Copilot Orchestra.
 * Guides users through project setup with smart defaults.
 * 
 * Usage:
 *   node tools/setup-wizard.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class SetupWizard {
  constructor() {
    this.rootDir = process.cwd();
    this.config = {};
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║     GitHub Copilot Orchestra - Interactive Setup Wizard          ║
╚═══════════════════════════════════════════════════════════════════╝

This wizard will help you set up GitHub Copilot Orchestra in your project.

`);

    try {
      await this.detectProjectType();
      await this.checkPrerequisites();
      await this.configureProject();
      await this.setupAgents();
      await this.setupDirectories();
      await this.setupTestFramework();
      await this.setupGit();
      await this.generateDocs();
      await this.runFinalChecks();
      
      this.showCompletionMessage();
    } catch (error) {
      console.log(`\n❌ Setup failed: ${error.message}`);
      console.log('You can run this wizard again to retry.\n');
    } finally {
      this.rl.close();
    }
  }

  async detectProjectType() {
    console.log('📊 Step 1/8: Detecting project type...\n');
    
    const detectors = {
      'Node.js': () => fs.existsSync(path.join(this.rootDir, 'package.json')),
      'Python': () => fs.existsSync(path.join(this.rootDir, 'requirements.txt')) || 
                      fs.existsSync(path.join(this.rootDir, 'pyproject.toml')),
      'Java': () => fs.existsSync(path.join(this.rootDir, 'pom.xml')) ||
                    fs.existsSync(path.join(this.rootDir, 'build.gradle')),
      'Ruby': () => fs.existsSync(path.join(this.rootDir, 'Gemfile')),
      'PHP': () => fs.existsSync(path.join(this.rootDir, 'composer.json')),
      'Go': () => fs.existsSync(path.join(this.rootDir, 'go.mod')),
      'Rust': () => fs.existsSync(path.join(this.rootDir, 'Cargo.toml'))
    };
    
    const detected = Object.entries(detectors)
      .filter(([_, detector]) => detector())
      .map(([type]) => type);
    
    if (detected.length > 0) {
      console.log(`✅ Detected: ${detected.join(', ')}`);
      this.config.projectType = detected[0];
    } else {
      console.log('❓ Could not detect project type');
      const type = await this.prompt('Enter project type (Node.js/Python/Java/Other): ');
      this.config.projectType = type || 'Other';
    }
    
    console.log('');
  }

  async checkPrerequisites() {
    console.log('🔍 Step 2/8: Checking prerequisites...\n');
    
    const checks = [];
    
    // Check VS Code Insiders
    try {
      execSync('code-insiders --version', { stdio: 'pipe' });
      checks.push({ name: 'VS Code Insiders', status: 'found' });
    } catch (e) {
      checks.push({ name: 'VS Code Insiders', status: 'not found' });
    }
    
    // Check Git
    try {
      execSync('git --version', { stdio: 'pipe' });
      checks.push({ name: 'Git', status: 'found' });
    } catch (e) {
      checks.push({ name: 'Git', status: 'not found' });
    }
    
    // Check Node.js (for tools)
    try {
      execSync('node --version', { stdio: 'pipe' });
      checks.push({ name: 'Node.js', status: 'found' });
    } catch (e) {
      checks.push({ name: 'Node.js', status: 'not found' });
    }
    
    checks.forEach(check => {
      const icon = check.status === 'found' ? '✅' : '❌';
      console.log(`${icon} ${check.name}: ${check.status}`);
    });
    
    const missing = checks.filter(c => c.status === 'not found');
    if (missing.length > 0) {
      console.log(`\n⚠️  Missing requirements: ${missing.map(c => c.name).join(', ')}`);
      console.log('Please install missing prerequisites and run the wizard again.');
      const cont = await this.prompt('\nContinue anyway? (y/n): ');
      if (cont.toLowerCase() !== 'y') {
        throw new Error('Prerequisites not met');
      }
    }
    
    console.log('');
  }

  async configureProject() {
    console.log('⚙️  Step 3/8: Project configuration...\n');
    
    const projectName = path.basename(this.rootDir);
    const name = await this.prompt(`Project name (${projectName}): `);
    this.config.name = name || projectName;
    
    const description = await this.prompt('Project description: ');
    this.config.description = description;
    
    console.log('');
  }

  async setupAgents() {
    console.log('🤖 Step 4/8: Setting up agent files...\n');
    
    const agentFiles = [
      'Conductor.agent.md',
      'planning-subagent.agent.md',
      'implement-subagent.agent.md',
      'code-review-subagent.agent.md',
      'quality-assurance-subagent.agent.md'
    ];
    
    const agentsDir = path.join(this.rootDir, '.github', 'agents');
    const existing = agentFiles.filter(file =>
      fs.existsSync(path.join(agentsDir, file))
    );
    
    if (existing.length === 5) {
      console.log('✅ All agent files already present in .github/agents/');
      console.log('');
      return;
    }
    
    console.log('Agent files are needed for Orchestra to work.');
    console.log('\nOptions:');
    console.log('1. Copy from Orchestra repository (recommended)');
    console.log('2. Install globally in VS Code Insiders');
    console.log('3. Skip (configure manually later)');
    
    const choice = await this.prompt('\nChoice (1/2/3): ');
    
    if (choice === '1') {
      console.log('\nTo copy agent files:');
      console.log('1. Clone: git clone https://github.com/killo431/copilot-orchestra.git');
      console.log('2. Copy agent files: cp -r copilot-orchestra/.github/agents /path/to/your/project/.github/');
      console.log('');
      await this.prompt('Press Enter when done...');
    } else if (choice === '2') {
      const userDataPath = this.getUserDataPath();
      console.log(`\nInstall agents in: ${userDataPath}`);
      console.log('This allows using Orchestra in any project.');
      console.log('\nSee README.md for detailed instructions.');
    } else {
      console.log('\n⏭️  Skipping agent setup');
    }
    
    console.log('');
  }

  getUserDataPath() {
    const platform = process.platform;
    if (platform === 'darwin') {
      return '~/Library/Application Support/Code - Insiders/User/prompts/';
    } else if (platform === 'win32') {
      return '%APPDATA%\\Code - Insiders\\User\\prompts\\';
    } else {
      return '~/.config/Code - Insiders/User/prompts/';
    }
  }

  async setupDirectories() {
    console.log('📁 Step 5/8: Setting up directories...\n');
    
    const dirs = ['plans'];
    
    // Add project-specific directories
    if (this.config.projectType === 'Node.js') {
      const hasSrc = fs.existsSync(path.join(this.rootDir, 'src'));
      const hasTests = fs.existsSync(path.join(this.rootDir, 'tests')) ||
                       fs.existsSync(path.join(this.rootDir, '__tests__'));
      
      if (!hasSrc) {
        const createSrc = await this.prompt('Create src/ directory? (y/n): ');
        if (createSrc.toLowerCase() === 'y') {
          dirs.push('src');
        }
      }
      
      if (!hasTests) {
        const createTests = await this.prompt('Create tests/ directory? (y/n): ');
        if (createTests.toLowerCase() === 'y') {
          dirs.push('tests');
        }
      }
    }
    
    dirs.forEach(dir => {
      const dirPath = path.join(this.rootDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created ${dir}/`);
      } else {
        console.log(`✓ ${dir}/ already exists`);
      }
    });
    
    // Create .gitkeep in plans directory
    const gitkeepPath = path.join(this.rootDir, 'plans', '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }
    
    console.log('');
  }

  async setupTestFramework() {
    console.log('🧪 Step 6/8: Setting up testing...\n');
    
    if (this.config.projectType === 'Node.js') {
      const packageJsonPath = path.join(this.rootDir, 'package.json');
      
      if (!fs.existsSync(packageJsonPath)) {
        console.log('No package.json found. Skipping test setup.');
        console.log('');
        return;
      }
      
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      const hasJest = !!deps.jest;
      const hasVitest = !!deps.vitest;
      const hasTestFramework = hasJest || hasVitest || !!deps.mocha;
      
      if (hasTestFramework) {
        console.log('✅ Test framework already installed');
        console.log('');
        return;
      }
      
      const installTests = await this.prompt('Install Jest testing framework? (y/n): ');
      if (installTests.toLowerCase() === 'y') {
        console.log('\nInstalling Jest...');
        try {
          execSync('npm install --save-dev jest', {
            cwd: this.rootDir,
            stdio: 'inherit'
          });
          
          // Update package.json scripts
          if (!pkg.scripts) {
            pkg.scripts = {};
          }
          pkg.scripts.test = 'jest';
          
          fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
          
          console.log('✅ Jest installed and configured');
        } catch (e) {
          console.log('❌ Failed to install Jest. You can install it manually later.');
        }
      }
    } else if (this.config.projectType === 'Python') {
      const requirementsPath = path.join(this.rootDir, 'requirements.txt');
      let requirements = '';
      
      if (fs.existsSync(requirementsPath)) {
        requirements = fs.readFileSync(requirementsPath, 'utf8');
      }
      
      if (!requirements.includes('pytest')) {
        const installPytest = await this.prompt('Add pytest to requirements? (y/n): ');
        if (installPytest.toLowerCase() === 'y') {
          fs.appendFileSync(requirementsPath, '\npytest\npytest-cov\n');
          console.log('✅ Added pytest to requirements.txt');
        }
      } else {
        console.log('✅ pytest already in requirements');
      }
    }
    
    console.log('');
  }

  async setupGit() {
    console.log('📝 Step 7/8: Git configuration...\n');
    
    // Check if git is initialized
    if (!fs.existsSync(path.join(this.rootDir, '.git'))) {
      const initGit = await this.prompt('Initialize git repository? (y/n): ');
      if (initGit.toLowerCase() === 'y') {
        execSync('git init', { cwd: this.rootDir });
        console.log('✅ Git initialized');
      }
    } else {
      console.log('✓ Git already initialized');
    }
    
    // Setup .gitignore
    if (!fs.existsSync(path.join(this.rootDir, '.gitignore'))) {
      const createGitignore = await this.prompt('Create .gitignore? (y/n): ');
      if (createGitignore.toLowerCase() === 'y') {
        this.createGitignore();
        console.log('✅ .gitignore created');
      }
    } else {
      console.log('✓ .gitignore already exists');
    }
    
    console.log('');
  }

  createGitignore() {
    let content = `# Dependencies\nnode_modules/\n`;
    
    if (this.config.projectType === 'Python') {
      content += `__pycache__/\n*.py[cod]\nvenv/\nenv/\n`;
    }
    
    content += `
# Build outputs
dist/
build/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Orchestra plans (uncomment to exclude)
# plans/

# Logs
*.log
`;
    
    fs.writeFileSync(path.join(this.rootDir, '.gitignore'), content);
  }

  async generateDocs() {
    console.log('📚 Step 8/8: Documentation...\n');
    
    if (!fs.existsSync(path.join(this.rootDir, 'README.md'))) {
      const createReadme = await this.prompt('Create README.md? (y/n): ');
      if (createReadme.toLowerCase() === 'y') {
        this.createReadme();
        console.log('✅ README.md created');
      }
    } else {
      console.log('✓ README.md already exists');
    }
    
    // Generate project blueprint
    const generateBlueprint = await this.prompt('Generate project blueprint diagram? (y/n): ');
    if (generateBlueprint.toLowerCase() === 'y') {
      try {
        const BlueprintGenerator = require('./blueprint-generator.js');
        const generator = new BlueprintGenerator({ rootDir: this.rootDir });
        await generator.generate();
        console.log('✅ Project blueprint generated');
      } catch (e) {
        console.log('⚠️  Could not generate blueprint (blueprint-generator.js not found)');
      }
    }
    
    console.log('');
  }

  createReadme() {
    const content = `# ${this.config.name}

${this.config.description || 'Project description'}

## Setup

\`\`\`bash
${this.getInstallCommand()}
\`\`\`

## Development with GitHub Copilot Orchestra

This project uses [GitHub Copilot Orchestra](https://github.com/killo431/copilot-orchestra) for AI-assisted development.

### Prerequisites

- VS Code Insiders
- GitHub Copilot subscription
- Orchestra agent files installed

### Workflow

1. Open project in VS Code Insiders
2. Open Copilot Chat
3. Select "Conductor" agent from dropdown
4. Describe your feature or change
5. Review and approve the plan
6. Let Orchestra implement, test, and review
7. Commit after each phase

See [Orchestra documentation](https://github.com/killo431/copilot-orchestra) for details.

## Testing

\`\`\`bash
${this.getTestCommand()}
\`\`\`

## License

MIT
`;
    
    fs.writeFileSync(path.join(this.rootDir, 'README.md'), content);
  }

  getInstallCommand() {
    const commands = {
      'Node.js': 'npm install',
      'Python': 'pip install -r requirements.txt',
      'Java': 'mvn install',
      'Ruby': 'bundle install',
      'PHP': 'composer install',
      'Go': 'go mod download'
    };
    return commands[this.config.projectType] || 'Install dependencies';
  }

  getTestCommand() {
    const commands = {
      'Node.js': 'npm test',
      'Python': 'pytest',
      'Java': 'mvn test',
      'Ruby': 'bundle exec rspec',
      'PHP': 'vendor/bin/phpunit',
      'Go': 'go test ./...'
    };
    return commands[this.config.projectType] || 'Run tests';
  }

  async runFinalChecks() {
    console.log('🔍 Running final checks...\n');
    
    // Run error recovery scan
    try {
      const ErrorRecovery = require('./error-recovery.js');
      const recovery = new ErrorRecovery({ scan: true, rootDir: this.rootDir });
      await recovery.run();
    } catch (e) {
      console.log('⚠️  Could not run error recovery check');
    }
  }

  showCompletionMessage() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                    ✅ Setup Complete!                            ║
╚═══════════════════════════════════════════════════════════════════╝

Your project is now configured for GitHub Copilot Orchestra!

📋 Next Steps:

1. Open project in VS Code Insiders:
   code-insiders .

2. Ensure agent files are installed:
   - Check chat mode dropdown for "Conductor" agent
   - If missing, see README.md for installation instructions

3. Start your first task:
   - Open Copilot Chat
   - Select "Conductor" agent
   - Describe what you want to build

📚 Resources:

- Quick Start: ${path.join(this.rootDir, 'QUICKSTART.md')} (if available)
- Documentation: https://github.com/killo431/copilot-orchestra
- Integration Guides: Check integrations/ directory

💡 Tips:

- Be specific in your requests to the Conductor
- Review plans carefully before approving
- Commit after each phase
- Keep phases small and focused

Happy coding with Orchestra! 🎉
`);
  }

  prompt(question) {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }
}

// CLI Interface
if (require.main === module) {
  const wizard = new SetupWizard();
  wizard.run().catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  });
}

module.exports = SetupWizard;
