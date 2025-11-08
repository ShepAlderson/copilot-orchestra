#!/usr/bin/env node

/**
 * System Blueprint Diagram Generator
 * 
 * Automatically generates project architecture diagrams by analyzing
 * your codebase structure, dependencies, and patterns.
 * 
 * Usage:
 *   node tools/blueprint-generator.js [options]
 *   
 * Options:
 *   --output, -o    Output file (default: PROJECT-BLUEPRINT.md)
 *   --format, -f    Format: markdown, mermaid, ascii (default: markdown)
 *   --depth, -d     Analysis depth: shallow, medium, deep (default: medium)
 *   --include, -i   Include patterns (comma-separated)
 *   --exclude, -e   Exclude patterns (comma-separated)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BlueprintGenerator {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.outputFile = options.output || 'PROJECT-BLUEPRINT.md';
    this.format = options.format || 'markdown';
    this.depth = options.depth || 'medium';
    this.includePatterns = options.include || [];
    this.excludePatterns = options.exclude || [
      'node_modules', '.git', 'dist', 'build', 'coverage',
      '*.log', '.env', 'plans'
    ];
    
    this.projectInfo = {};
    this.fileStructure = {};
    this.dependencies = {};
    this.patterns = {
      frontend: [],
      backend: [],
      database: [],
      testing: [],
      deployment: []
    };
  }

  async generate() {
    console.log('🔍 Analyzing project structure...');
    
    this.analyzeProjectInfo();
    this.analyzeFileStructure();
    this.analyzeDependencies();
    this.detectPatterns();
    
    console.log('📊 Generating blueprint diagram...');
    
    const blueprint = this.createBlueprint();
    
    fs.writeFileSync(this.outputFile, blueprint);
    
    console.log(`✅ Blueprint generated: ${this.outputFile}`);
    console.log(`📁 Project: ${this.projectInfo.name}`);
    console.log(`📦 Type: ${this.projectInfo.type}`);
    console.log(`🎯 Patterns detected: ${this.getPatternCount()} patterns`);
    
    return this.outputFile;
  }

  analyzeProjectInfo() {
    const packageJsonPath = path.join(this.rootDir, 'package.json');
    const requirementsPath = path.join(this.rootDir, 'requirements.txt');
    const pomPath = path.join(this.rootDir, 'pom.xml');
    const composerPath = path.join(this.rootDir, 'composer.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      this.projectInfo = {
        name: pkg.name || 'Unknown Project',
        version: pkg.version || '1.0.0',
        description: pkg.description || '',
        type: 'Node.js/JavaScript',
        language: 'JavaScript/TypeScript'
      };
    } else if (fs.existsSync(requirementsPath)) {
      this.projectInfo = {
        name: path.basename(this.rootDir),
        version: '1.0.0',
        type: 'Python',
        language: 'Python'
      };
    } else if (fs.existsSync(pomPath)) {
      this.projectInfo = {
        name: path.basename(this.rootDir),
        version: '1.0.0',
        type: 'Java/Maven',
        language: 'Java'
      };
    } else if (fs.existsSync(composerPath)) {
      const composer = JSON.parse(fs.readFileSync(composerPath, 'utf8'));
      this.projectInfo = {
        name: composer.name || path.basename(this.rootDir),
        version: composer.version || '1.0.0',
        type: 'PHP',
        language: 'PHP'
      };
    } else {
      this.projectInfo = {
        name: path.basename(this.rootDir),
        version: '1.0.0',
        type: 'Unknown',
        language: 'Unknown'
      };
    }
  }

  analyzeFileStructure() {
    const structure = this.buildDirectoryTree(this.rootDir, 0, 3);
    this.fileStructure = structure;
  }

  buildDirectoryTree(dir, level, maxLevel) {
    if (level > maxLevel) return null;
    
    const stats = fs.statSync(dir);
    if (!stats.isDirectory()) return null;
    
    const name = path.basename(dir);
    
    // Skip excluded patterns
    if (this.shouldExclude(name)) return null;
    
    try {
      const children = fs.readdirSync(dir)
        .map(child => {
          const childPath = path.join(dir, child);
          try {
            const childStats = fs.statSync(childPath);
            if (childStats.isDirectory()) {
              const subtree = this.buildDirectoryTree(childPath, level + 1, maxLevel);
              return subtree;
            } else {
              if (this.shouldExclude(child)) return null;
              return { name: child, type: 'file' };
            }
          } catch (e) {
            return null;
          }
        })
        .filter(child => child !== null);
      
      return {
        name,
        type: 'directory',
        children
      };
    } catch (e) {
      return { name, type: 'directory', children: [] };
    }
  }

  shouldExclude(name) {
    return this.excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(name);
      }
      return name === pattern || name.includes(pattern);
    });
  }

  analyzeDependencies() {
    const packageJsonPath = path.join(this.rootDir, 'package.json');
    const requirementsPath = path.join(this.rootDir, 'requirements.txt');
    
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      this.dependencies = {
        runtime: Object.keys(pkg.dependencies || {}),
        development: Object.keys(pkg.devDependencies || {})
      };
    } else if (fs.existsSync(requirementsPath)) {
      const requirements = fs.readFileSync(requirementsPath, 'utf8')
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => line.split(/[=<>]/)[0].trim());
      this.dependencies = {
        runtime: requirements,
        development: []
      };
    }
  }

  detectPatterns() {
    const deps = [
      ...(this.dependencies.runtime || []),
      ...(this.dependencies.development || [])
    ];
    
    // Frontend patterns
    if (deps.some(d => ['react', 'next', 'vue', 'angular'].includes(d.toLowerCase()))) {
      this.patterns.frontend.push('Component-based UI');
    }
    if (deps.some(d => ['redux', 'zustand', 'mobx', 'vuex'].includes(d.toLowerCase()))) {
      this.patterns.frontend.push('State Management');
    }
    
    // Backend patterns
    if (deps.some(d => ['express', 'koa', 'fastify', 'hapi'].includes(d.toLowerCase()))) {
      this.patterns.backend.push('REST API');
    }
    if (deps.some(d => d.includes('graphql'))) {
      this.patterns.backend.push('GraphQL API');
    }
    if (deps.some(d => ['django', 'flask', 'fastapi'].includes(d.toLowerCase()))) {
      this.patterns.backend.push('Python Web Framework');
    }
    
    // Database patterns
    if (deps.some(d => ['mongoose', 'mongodb', 'pg', 'mysql', 'sqlite3'].includes(d.toLowerCase()))) {
      this.patterns.database.push('Database Integration');
    }
    if (deps.some(d => d.includes('prisma') || d.includes('typeorm') || d.includes('sequelize'))) {
      this.patterns.database.push('ORM');
    }
    
    // Testing patterns
    if (deps.some(d => ['jest', 'mocha', 'vitest', 'pytest', 'junit'].includes(d.toLowerCase()))) {
      this.patterns.testing.push('Unit Testing');
    }
    if (deps.some(d => d.includes('testing-library') || d.includes('cypress') || d.includes('playwright'))) {
      this.patterns.testing.push('E2E/Integration Testing');
    }
    
    // Deployment patterns
    if (fs.existsSync(path.join(this.rootDir, 'Dockerfile'))) {
      this.patterns.deployment.push('Docker Containerization');
    }
    if (fs.existsSync(path.join(this.rootDir, '.github/workflows'))) {
      this.patterns.deployment.push('GitHub Actions CI/CD');
    }
  }

  getPatternCount() {
    return Object.values(this.patterns).reduce((sum, arr) => sum + arr.length, 0);
  }

  createBlueprint() {
    const sections = [];
    
    sections.push(this.createHeader());
    sections.push(this.createOverview());
    sections.push(this.createArchitectureDiagram());
    sections.push(this.createFileStructure());
    sections.push(this.createDependencies());
    sections.push(this.createPatterns());
    sections.push(this.createDataFlow());
    sections.push(this.createRecommendations());
    
    return sections.join('\n\n');
  }

  createHeader() {
    const date = new Date().toISOString().split('T')[0];
    return `# ${this.projectInfo.name} - System Blueprint

> Auto-generated on ${date} by GitHub Copilot Orchestra Blueprint Generator

---`;
  }

  createOverview() {
    return `## Project Overview

**Project Name:** ${this.projectInfo.name}  
**Version:** ${this.projectInfo.version}  
**Type:** ${this.projectInfo.type}  
**Language:** ${this.projectInfo.language}  
${this.projectInfo.description ? `**Description:** ${this.projectInfo.description}` : ''}

**Patterns Detected:** ${this.getPatternCount()} architectural patterns identified`;
  }

  createArchitectureDiagram() {
    const hasBackend = this.patterns.backend.length > 0;
    const hasFrontend = this.patterns.frontend.length > 0;
    const hasDatabase = this.patterns.database.length > 0;
    
    let diagram = `## System Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     ${this.projectInfo.name}                    
└─────────────────────────────────────────────────────────────────┘
`;

    if (hasFrontend) {
      diagram += `
┌──────────────────────────┐
│   Frontend Layer         │
│   ${this.patterns.frontend.join(', ') || 'UI Components'}
└──────────┬───────────────┘
           │
           ↓ HTTP/API
`;
    }

    if (hasBackend) {
      diagram += `
┌──────────────────────────┐
│   Backend Layer          │
│   ${this.patterns.backend.join(', ') || 'API Server'}
└──────────┬───────────────┘
           │
           ↓ Queries
`;
    }

    if (hasDatabase) {
      diagram += `
┌──────────────────────────┐
│   Database Layer         │
│   ${this.patterns.database.join(', ') || 'Data Storage'}
└──────────────────────────┘
`;
    }

    diagram += '```';
    
    return diagram;
  }

  createFileStructure() {
    let output = '## File Structure\n\n```\n';
    output += this.renderTree(this.fileStructure, '');
    output += '```';
    return output;
  }

  renderTree(node, prefix) {
    if (!node) return '';
    
    let result = prefix + node.name + (node.type === 'directory' ? '/' : '') + '\n';
    
    if (node.children && node.children.length > 0) {
      const sortedChildren = node.children.sort((a, b) => {
        if (a.type === 'directory' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
      });
      
      sortedChildren.forEach((child, index) => {
        const isLast = index === sortedChildren.length - 1;
        const newPrefix = prefix + (isLast ? '└── ' : '├── ');
        const childPrefix = prefix + (isLast ? '    ' : '│   ');
        
        if (child.type === 'directory') {
          result += newPrefix + child.name + '/\n';
          if (child.children) {
            child.children.forEach((grandchild, gIndex) => {
              const gIsLast = gIndex === child.children.length - 1;
              result += childPrefix + (gIsLast ? '└── ' : '├── ') + grandchild.name + (grandchild.type === 'directory' ? '/' : '') + '\n';
            });
          }
        } else {
          result += newPrefix + child.name + '\n';
        }
      });
    }
    
    return result;
  }

  createDependencies() {
    let output = '## Dependencies\n\n';
    
    if (this.dependencies.runtime && this.dependencies.runtime.length > 0) {
      output += '### Runtime Dependencies\n\n';
      this.dependencies.runtime.slice(0, 15).forEach(dep => {
        output += `- ${dep}\n`;
      });
      if (this.dependencies.runtime.length > 15) {
        output += `- ... and ${this.dependencies.runtime.length - 15} more\n`;
      }
      output += '\n';
    }
    
    if (this.dependencies.development && this.dependencies.development.length > 0) {
      output += '### Development Dependencies\n\n';
      this.dependencies.development.slice(0, 10).forEach(dep => {
        output += `- ${dep}\n`;
      });
      if (this.dependencies.development.length > 10) {
        output += `- ... and ${this.dependencies.development.length - 10} more\n`;
      }
    }
    
    return output;
  }

  createPatterns() {
    let output = '## Architectural Patterns\n\n';
    
    Object.entries(this.patterns).forEach(([category, patterns]) => {
      if (patterns.length > 0) {
        output += `### ${this.capitalize(category)}\n\n`;
        patterns.forEach(pattern => {
          output += `- ✅ ${pattern}\n`;
        });
        output += '\n';
      }
    });
    
    if (this.getPatternCount() === 0) {
      output += '*No specific patterns detected. This might be a new or minimal project.*\n';
    }
    
    return output;
  }

  createDataFlow() {
    return `## Data Flow

\`\`\`
User/Client
    │
    ↓ Request
┌─────────────┐
│  Frontend   │ (UI Components, State Management)
└──────┬──────┘
       │
       ↓ API Call
┌─────────────┐
│  Backend    │ (Business Logic, Validation)
└──────┬──────┘
       │
       ↓ Query
┌─────────────┐
│  Database   │ (Data Persistence)
└─────────────┘
\`\`\``;
  }

  createRecommendations() {
    const recommendations = [];
    
    if (this.patterns.testing.length === 0) {
      recommendations.push('**Add Testing Framework** - No testing patterns detected. Consider adding Jest, pytest, or similar.');
    }
    
    if (!fs.existsSync(path.join(this.rootDir, 'README.md'))) {
      recommendations.push('**Add README** - Project lacks documentation. Create a comprehensive README.md.');
    }
    
    if (!fs.existsSync(path.join(this.rootDir, '.gitignore'))) {
      recommendations.push('**Add .gitignore** - No .gitignore file found. Add one to exclude build artifacts.');
    }
    
    if (this.patterns.deployment.length === 0) {
      recommendations.push('**Setup CI/CD** - No deployment patterns detected. Consider adding GitHub Actions or similar.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ **Project structure looks good!** All essential components are in place.');
    }
    
    return `## Recommendations\n\n${recommendations.map(r => `- ${r}`).join('\n')}

---

*Blueprint generated by GitHub Copilot Orchestra*  
*Run \`node tools/blueprint-generator.js\` to regenerate*`;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--format' || arg === '-f') {
      options.format = args[++i];
    } else if (arg === '--depth' || arg === '-d') {
      options.depth = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
GitHub Copilot Orchestra - Blueprint Generator

Usage: node tools/blueprint-generator.js [options]

Options:
  --output, -o    Output file (default: PROJECT-BLUEPRINT.md)
  --format, -f    Format: markdown, mermaid, ascii (default: markdown)
  --depth, -d     Analysis depth: shallow, medium, deep (default: medium)
  --help, -h      Show this help message

Examples:
  node tools/blueprint-generator.js
  node tools/blueprint-generator.js --output ARCHITECTURE.md
  node tools/blueprint-generator.js --depth deep
      `);
      process.exit(0);
    }
  }
  
  const generator = new BlueprintGenerator(options);
  generator.generate().catch(err => {
    console.error('❌ Error generating blueprint:', err.message);
    process.exit(1);
  });
}

module.exports = BlueprintGenerator;
