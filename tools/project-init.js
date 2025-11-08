#!/usr/bin/env node

/**
 * Project Initialization Wizard
 * 
 * Interactive wizard for initializing new projects with architecture-first approach.
 * Captures project requirements, generates architecture blueprints, and sets up
 * project structure with proper scaffolding.
 * 
 * Usage:
 *   node tools/project-init.js [project-name]
 *   
 * Features:
 *   - Interactive project requirements gathering
 *   - Architecture blueprint generation
 *   - Project type templates (React, Node.js, Python, etc.)
 *   - API contract definition
 *   - Database schema planning
 *   - Deployment target configuration
 *   - Authentication/authorization setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class ProjectInitWizard {
  constructor(projectName) {
    this.projectName = projectName;
    this.projectDir = projectName ? path.join(process.cwd(), projectName) : process.cwd();
    this.config = {
      project: {},
      architecture: {},
      apis: [],
      database: {},
      deployment: {},
      authentication: {},
      environment: {}
    };
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║     GitHub Copilot Orchestra - Project Initialization            ║
╚═══════════════════════════════════════════════════════════════════╝

This wizard will help you initialize a new project with architecture-first
approach, capturing all technical requirements upfront.

`);

    try {
      await this.gatherProjectInfo();
      await this.defineArchitecture();
      await this.defineAPIs();
      await this.defineDatabaseRequirements();
      await this.defineAuthentication();
      await this.defineDeploymentTargets();
      await this.defineEnvironment();
      await this.reviewConfiguration();
      
      const confirmed = await this.confirm('\nProceed with project initialization? (y/n): ');
      
      if (confirmed) {
        await this.createProjectStructure();
        await this.generateBlueprint();
        await this.generateTemplates();
        await this.initializeGit();
        this.showCompletionMessage();
      } else {
        console.log('\n⏸️  Project initialization cancelled.\n');
      }
    } catch (error) {
      console.log(`\n❌ Initialization failed: ${error.message}`);
      console.log('You can run this wizard again to retry.\n');
    } finally {
      this.rl.close();
    }
  }

  async gatherProjectInfo() {
    console.log('📋 Step 1/7: Project Information\n');
    
    if (!this.projectName) {
      this.projectName = await this.prompt('Project name: ');
      this.projectDir = path.join(process.cwd(), this.projectName);
    }
    
    this.config.project.name = this.projectName;
    this.config.project.description = await this.prompt('Project description: ');
    
    console.log('\nSelect project type:');
    console.log('1. Web Application (Frontend + Backend)');
    console.log('2. REST API Service');
    console.log('3. GraphQL API Service');
    console.log('4. CLI Tool');
    console.log('5. Microservice');
    console.log('6. Library/Package');
    console.log('7. Mobile App Backend');
    console.log('8. Other');
    
    const typeChoice = await this.prompt('\nChoice (1-8): ');
    const types = ['web-app', 'rest-api', 'graphql-api', 'cli-tool', 'microservice', 'library', 'mobile-backend', 'other'];
    this.config.project.type = types[parseInt(typeChoice) - 1] || 'other';
    
    console.log('\nSelect primary language/framework:');
    console.log('1. JavaScript/TypeScript (Node.js)');
    console.log('2. Python');
    console.log('3. Java');
    console.log('4. Go');
    console.log('5. Ruby');
    console.log('6. C#/.NET');
    console.log('7. PHP');
    console.log('8. Other');
    
    const langChoice = await this.prompt('\nChoice (1-8): ');
    const languages = ['nodejs', 'python', 'java', 'go', 'ruby', 'dotnet', 'php', 'other'];
    this.config.project.language = languages[parseInt(langChoice) - 1] || 'other';
    
    if (this.config.project.type === 'web-app') {
      console.log('\nSelect frontend framework:');
      console.log('1. React');
      console.log('2. Vue.js');
      console.log('3. Angular');
      console.log('4. Next.js');
      console.log('5. Svelte');
      console.log('6. None (API only)');
      
      const frontendChoice = await this.prompt('\nChoice (1-6): ');
      const frameworks = ['react', 'vue', 'angular', 'nextjs', 'svelte', 'none'];
      this.config.project.frontend = frameworks[parseInt(frontendChoice) - 1] || 'none';
    }
    
    console.log('');
  }

  async defineArchitecture() {
    console.log('🏗️  Step 2/7: Architecture Design\n');
    
    console.log('Select architecture pattern:');
    console.log('1. Monolithic');
    console.log('2. Microservices');
    console.log('3. Serverless');
    console.log('4. Layered (MVC/3-tier)');
    console.log('5. Event-driven');
    console.log('6. CQRS (Command Query Responsibility Segregation)');
    
    const archChoice = await this.prompt('\nChoice (1-6): ');
    const patterns = ['monolithic', 'microservices', 'serverless', 'layered', 'event-driven', 'cqrs'];
    this.config.architecture.pattern = patterns[parseInt(archChoice) - 1] || 'layered';
    
    console.log('\nDefine system components (comma-separated):');
    console.log('Examples: api-gateway, auth-service, user-service, notification-service');
    const components = await this.prompt('Components: ');
    this.config.architecture.components = components ? components.split(',').map(c => c.trim()) : [];
    
    const hasCache = await this.confirm('\nWill the system use caching? (y/n): ');
    if (hasCache) {
      console.log('\nSelect caching solution:');
      console.log('1. Redis');
      console.log('2. Memcached');
      console.log('3. In-memory (application)');
      console.log('4. CDN caching');
      
      const cacheChoice = await this.prompt('\nChoice (1-4): ');
      const caches = ['redis', 'memcached', 'in-memory', 'cdn'];
      this.config.architecture.cache = caches[parseInt(cacheChoice) - 1] || 'redis';
    }
    
    const hasQueue = await this.confirm('\nWill the system use message queues? (y/n): ');
    if (hasQueue) {
      console.log('\nSelect message queue:');
      console.log('1. RabbitMQ');
      console.log('2. Apache Kafka');
      console.log('3. AWS SQS');
      console.log('4. Redis Queue');
      console.log('5. Other');
      
      const queueChoice = await this.prompt('\nChoice (1-5): ');
      const queues = ['rabbitmq', 'kafka', 'aws-sqs', 'redis-queue', 'other'];
      this.config.architecture.messageQueue = queues[parseInt(queueChoice) - 1] || 'rabbitmq';
    }
    
    console.log('');
  }

  async defineAPIs() {
    console.log('🔌 Step 3/7: API Definition\n');
    
    if (this.config.project.type === 'cli-tool' || this.config.project.type === 'library') {
      console.log('Skipping API definition for CLI tool/library.\n');
      return;
    }
    
    const hasAPI = await this.confirm('Does this project expose APIs? (y/n): ');
    if (!hasAPI) {
      console.log('');
      return;
    }
    
    console.log('\nDefine API endpoints (one at a time, empty to finish):');
    console.log('Format: METHOD /path - Description');
    console.log('Example: GET /api/users - Get all users\n');
    
    let endpoint = await this.prompt('Endpoint 1: ');
    let counter = 2;
    
    while (endpoint) {
      const match = endpoint.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(\/[^\s]*)\s*-\s*(.+)$/i);
      if (match) {
        this.config.apis.push({
          method: match[1].toUpperCase(),
          path: match[2],
          description: match[3]
        });
      }
      endpoint = await this.prompt(`Endpoint ${counter}: `);
      counter++;
    }
    
    if (this.config.apis.length > 0) {
      const hasAuth = await this.confirm('\nDo any endpoints require authentication? (y/n): ');
      this.config.architecture.requiresAuth = hasAuth;
      
      const hasRateLimit = await this.confirm('Should APIs be rate-limited? (y/n): ');
      this.config.architecture.rateLimit = hasRateLimit;
      
      const hasVersioning = await this.confirm('Will APIs be versioned? (y/n): ');
      this.config.architecture.apiVersioning = hasVersioning;
    }
    
    console.log('');
  }

  async defineDatabaseRequirements() {
    console.log('💾 Step 4/7: Database Requirements\n');
    
    const needsDB = await this.confirm('Does the project need a database? (y/n): ');
    if (!needsDB) {
      this.config.database.type = 'none';
      console.log('');
      return;
    }
    
    console.log('\nSelect database type:');
    console.log('1. PostgreSQL');
    console.log('2. MySQL/MariaDB');
    console.log('3. MongoDB');
    console.log('4. SQLite');
    console.log('5. Redis');
    console.log('6. DynamoDB');
    console.log('7. Cassandra');
    console.log('8. Multiple databases');
    
    const dbChoice = await this.prompt('\nChoice (1-8): ');
    const databases = ['postgresql', 'mysql', 'mongodb', 'sqlite', 'redis', 'dynamodb', 'cassandra', 'multiple'];
    this.config.database.type = databases[parseInt(dbChoice) - 1] || 'postgresql';
    
    if (this.config.database.type !== 'none') {
      console.log('\nDefine main entities/tables (comma-separated):');
      console.log('Examples: users, posts, comments, products, orders');
      const entities = await this.prompt('Entities: ');
      this.config.database.entities = entities ? entities.split(',').map(e => e.trim()) : [];
      
      const needsMigrations = await this.confirm('\nWill you use database migrations? (y/n): ');
      this.config.database.migrations = needsMigrations;
      
      const needsSeeding = await this.confirm('Will you need seed data for development? (y/n): ');
      this.config.database.seeding = needsSeeding;
    }
    
    console.log('');
  }

  async defineAuthentication() {
    console.log('🔐 Step 5/7: Authentication & Authorization\n');
    
    const needsAuth = await this.confirm('Does the project need authentication? (y/n): ');
    if (!needsAuth) {
      this.config.authentication.type = 'none';
      console.log('');
      return;
    }
    
    console.log('\nSelect authentication method:');
    console.log('1. JWT (JSON Web Tokens)');
    console.log('2. OAuth 2.0');
    console.log('3. Session-based');
    console.log('4. API Keys');
    console.log('5. SAML');
    console.log('6. Multiple methods');
    
    const authChoice = await this.prompt('\nChoice (1-6): ');
    const authTypes = ['jwt', 'oauth2', 'session', 'api-key', 'saml', 'multiple'];
    this.config.authentication.type = authTypes[parseInt(authChoice) - 1] || 'jwt';
    
    const needsOAuthProvider = await this.confirm('\nSupport social login (Google, GitHub, etc.)? (y/n): ');
    this.config.authentication.socialLogin = needsOAuthProvider;
    
    const needsRBAC = await this.confirm('Need role-based access control (RBAC)? (y/n): ');
    this.config.authentication.rbac = needsRBAC;
    
    if (needsRBAC) {
      console.log('\nDefine user roles (comma-separated):');
      console.log('Examples: admin, user, moderator, guest');
      const roles = await this.prompt('Roles: ');
      this.config.authentication.roles = roles ? roles.split(',').map(r => r.trim()) : ['admin', 'user'];
    }
    
    console.log('');
  }

  async defineDeploymentTargets() {
    console.log('🚀 Step 6/7: Deployment Configuration\n');
    
    console.log('Select deployment target(s):');
    console.log('1. Docker/Docker Compose');
    console.log('2. Kubernetes');
    console.log('3. AWS (EC2, ECS, Lambda)');
    console.log('4. Azure');
    console.log('5. Google Cloud Platform');
    console.log('6. Heroku');
    console.log('7. Vercel/Netlify');
    console.log('8. Traditional server (bare metal/VM)');
    
    const deployChoice = await this.prompt('\nChoice (1-8, comma-separated for multiple): ');
    const deployTargets = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'heroku', 'vercel', 'traditional'];
    
    this.config.deployment.targets = deployChoice
      .split(',')
      .map(c => deployTargets[parseInt(c.trim()) - 1])
      .filter(Boolean);
    
    const needsCI = await this.confirm('\nSet up CI/CD pipeline? (y/n): ');
    if (needsCI) {
      console.log('\nSelect CI/CD platform:');
      console.log('1. GitHub Actions');
      console.log('2. GitLab CI');
      console.log('3. Jenkins');
      console.log('4. CircleCI');
      console.log('5. Travis CI');
      
      const ciChoice = await this.prompt('\nChoice (1-5): ');
      const ciPlatforms = ['github-actions', 'gitlab-ci', 'jenkins', 'circleci', 'travis'];
      this.config.deployment.cicd = ciPlatforms[parseInt(ciChoice) - 1] || 'github-actions';
    }
    
    const needsDocker = this.config.deployment.targets.includes('docker') || 
                        this.config.deployment.targets.includes('kubernetes');
    this.config.deployment.docker = needsDocker;
    
    console.log('');
  }

  async defineEnvironment() {
    console.log('🌍 Step 7/7: Environment Configuration\n');
    
    console.log('Define environment variables needed (one per line, empty to finish):');
    console.log('Format: VAR_NAME - Description');
    console.log('Example: DATABASE_URL - PostgreSQL connection string\n');
    
    const envVars = [];
    let envVar = await this.prompt('Variable 1: ');
    let counter = 2;
    
    while (envVar) {
      const match = envVar.match(/^([A-Z_]+)\s*-\s*(.+)$/);
      if (match) {
        envVars.push({
          name: match[1],
          description: match[2]
        });
      }
      envVar = await this.prompt(`Variable ${counter}: `);
      counter++;
    }
    
    this.config.environment.variables = envVars;
    
    console.log('\nDefine environments needed:');
    console.log('1. Development, Staging, Production');
    console.log('2. Development, Production');
    console.log('3. Development only');
    console.log('4. Custom');
    
    const envChoice = await this.prompt('\nChoice (1-4): ');
    const envSetups = [
      ['development', 'staging', 'production'],
      ['development', 'production'],
      ['development'],
      []
    ];
    this.config.environment.environments = envSetups[parseInt(envChoice) - 1] || ['development', 'production'];
    
    console.log('');
  }

  async reviewConfiguration() {
    console.log('📝 Configuration Review\n');
    console.log('═'.repeat(70));
    
    console.log(`\n📦 Project: ${this.config.project.name}`);
    console.log(`   Type: ${this.config.project.type}`);
    console.log(`   Language: ${this.config.project.language}`);
    if (this.config.project.frontend) {
      console.log(`   Frontend: ${this.config.project.frontend}`);
    }
    
    console.log(`\n🏗️  Architecture: ${this.config.architecture.pattern}`);
    if (this.config.architecture.components.length > 0) {
      console.log(`   Components: ${this.config.architecture.components.join(', ')}`);
    }
    if (this.config.architecture.cache) {
      console.log(`   Cache: ${this.config.architecture.cache}`);
    }
    if (this.config.architecture.messageQueue) {
      console.log(`   Message Queue: ${this.config.architecture.messageQueue}`);
    }
    
    if (this.config.apis.length > 0) {
      console.log(`\n🔌 APIs: ${this.config.apis.length} endpoint(s) defined`);
      this.config.apis.slice(0, 3).forEach(api => {
        console.log(`   ${api.method} ${api.path} - ${api.description}`);
      });
      if (this.config.apis.length > 3) {
        console.log(`   ... and ${this.config.apis.length - 3} more`);
      }
    }
    
    if (this.config.database.type !== 'none') {
      console.log(`\n💾 Database: ${this.config.database.type}`);
      if (this.config.database.entities.length > 0) {
        console.log(`   Entities: ${this.config.database.entities.join(', ')}`);
      }
    }
    
    if (this.config.authentication.type !== 'none') {
      console.log(`\n🔐 Authentication: ${this.config.authentication.type}`);
      if (this.config.authentication.roles) {
        console.log(`   Roles: ${this.config.authentication.roles.join(', ')}`);
      }
    }
    
    if (this.config.deployment.targets.length > 0) {
      console.log(`\n🚀 Deployment: ${this.config.deployment.targets.join(', ')}`);
      if (this.config.deployment.cicd) {
        console.log(`   CI/CD: ${this.config.deployment.cicd}`);
      }
    }
    
    console.log('\n' + '═'.repeat(70) + '\n');
  }

  async createProjectStructure() {
    console.log('📁 Creating project structure...\n');
    
    // Create project directory
    if (!fs.existsSync(this.projectDir)) {
      fs.mkdirSync(this.projectDir, { recursive: true });
    }
    
    // Create standard directories
    const dirs = [
      'src',
      'tests',
      'docs',
      'config',
      '.github/workflows'
    ];
    
    // Add language-specific directories
    if (this.config.project.language === 'nodejs') {
      dirs.push('src/controllers', 'src/models', 'src/routes', 'src/middleware', 'src/utils');
    } else if (this.config.project.language === 'python') {
      dirs.push('src/api', 'src/models', 'src/services', 'src/utils');
    }
    
    // Add component directories if microservices
    if (this.config.architecture.pattern === 'microservices') {
      this.config.architecture.components.forEach(component => {
        dirs.push(`services/${component}`);
      });
    }
    
    dirs.forEach(dir => {
      const fullPath = path.join(this.projectDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`  ✓ Created ${dir}/`);
      }
    });
    
    console.log('');
  }

  async generateBlueprint() {
    console.log('📋 Generating PROJECT-BLUEPRINT.md...\n');
    
    const blueprint = this.createBlueprintContent();
    fs.writeFileSync(path.join(this.projectDir, 'PROJECT-BLUEPRINT.md'), blueprint);
    
    console.log('  ✓ Generated PROJECT-BLUEPRINT.md\n');
  }

  createBlueprintContent() {
    const { project, architecture, apis, database, authentication, deployment, environment } = this.config;
    
    let content = `# ${project.name} - Project Blueprint

> ${project.description}

**Generated:** ${new Date().toISOString().split('T')[0]}

## Project Overview

- **Type:** ${project.type}
- **Primary Language:** ${project.language}
${project.frontend ? `- **Frontend Framework:** ${project.frontend}` : ''}
- **Architecture Pattern:** ${architecture.pattern}

## System Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    System Architecture                      │
└─────────────────────────────────────────────────────────────┘
`;

    // Add architecture diagram based on pattern
    if (architecture.pattern === 'layered') {
      content += `
                    ┌──────────────┐
                    │  Presentation │
                    │     Layer     │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │   Business   │
                    │     Logic    │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │  Data Access │
                    │     Layer    │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │   Database   │
                    └──────────────┘
`;
    } else if (architecture.pattern === 'microservices') {
      content += `
        ┌─────────────┐
        │ API Gateway │
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
`;
      architecture.components.slice(0, 3).forEach(component => {
        content += `┌─────────┐  `;
      });
      content += '\n';
      architecture.components.slice(0, 3).forEach(component => {
        const name = component.substring(0, 7).padEnd(7);
        content += `│${name}  │  `;
      });
      content += '\n';
      architecture.components.slice(0, 3).forEach(() => {
        content += `└─────────┘  `;
      });
      content += '\n';
    }

    content += '```\n\n';

    // Architecture Components
    if (architecture.components.length > 0) {
      content += '### System Components\n\n';
      architecture.components.forEach(component => {
        content += `- **${component}**: [Component description]\n`;
      });
      content += '\n';
    }

    // Technical Stack
    content += '## Technical Stack\n\n';
    content += `- **Backend:** ${project.language}\n`;
    if (project.frontend && project.frontend !== 'none') {
      content += `- **Frontend:** ${project.frontend}\n`;
    }
    if (database.type !== 'none') {
      content += `- **Database:** ${database.type}\n`;
    }
    if (architecture.cache) {
      content += `- **Cache:** ${architecture.cache}\n`;
    }
    if (architecture.messageQueue) {
      content += `- **Message Queue:** ${architecture.messageQueue}\n`;
    }
    content += '\n';

    // API Endpoints
    if (apis.length > 0) {
      content += '## API Endpoints\n\n';
      content += '| Method | Endpoint | Description | Auth Required |\n';
      content += '|--------|----------|-------------|---------------|\n';
      apis.forEach(api => {
        content += `| ${api.method} | ${api.path} | ${api.description} | ${architecture.requiresAuth ? '✓' : '—'} |\n`;
      });
      content += '\n';
      
      if (architecture.apiVersioning) {
        content += '**API Versioning:** Enabled (recommended: /api/v1/...)\n\n';
      }
      if (architecture.rateLimit) {
        content += '**Rate Limiting:** Enabled\n\n';
      }
    }

    // Database Schema
    if (database.type !== 'none' && database.entities.length > 0) {
      content += '## Database Schema\n\n';
      content += '### Entities\n\n';
      database.entities.forEach(entity => {
        content += `#### ${entity}\n\n`;
        content += '| Column | Type | Constraints |\n';
        content += '|--------|------|-------------|\n';
        content += '| id | UUID/INT | PRIMARY KEY |\n';
        content += '| created_at | TIMESTAMP | NOT NULL |\n';
        content += '| updated_at | TIMESTAMP | NOT NULL |\n';
        content += '| ... | ... | ... |\n\n';
      });
      
      if (database.migrations) {
        content += '**Database Migrations:** Enabled\n\n';
      }
    }

    // Authentication & Authorization
    if (authentication.type !== 'none') {
      content += '## Authentication & Authorization\n\n';
      content += `- **Method:** ${authentication.type}\n`;
      if (authentication.socialLogin) {
        content += '- **Social Login:** Supported (Google, GitHub, etc.)\n';
      }
      if (authentication.rbac && authentication.roles) {
        content += `- **Access Control:** Role-Based (RBAC)\n`;
        content += `- **Roles:** ${authentication.roles.join(', ')}\n`;
      }
      content += '\n';
    }

    // Environment Configuration
    if (environment.variables.length > 0) {
      content += '## Environment Configuration\n\n';
      content += '### Required Environment Variables\n\n';
      environment.variables.forEach(envVar => {
        content += `- **${envVar.name}**: ${envVar.description}\n`;
      });
      content += '\n';
    }

    if (environment.environments.length > 0) {
      content += '### Environments\n\n';
      environment.environments.forEach(env => {
        content += `- **${env}**: [Environment-specific configuration]\n`;
      });
      content += '\n';
    }

    // Deployment
    if (deployment.targets.length > 0) {
      content += '## Deployment\n\n';
      content += `**Target Platforms:** ${deployment.targets.join(', ')}\n\n`;
      
      if (deployment.docker) {
        content += '### Docker\n\n';
        content += 'The project includes:\n';
        content += '- `Dockerfile` for containerization\n';
        content += '- `docker-compose.yml` for local development\n\n';
      }
      
      if (deployment.cicd) {
        content += `### CI/CD Pipeline\n\n`;
        content += `**Platform:** ${deployment.cicd}\n\n`;
        content += 'Pipeline stages:\n';
        content += '1. Lint and format check\n';
        content += '2. Run tests\n';
        content += '3. Build application\n';
        content += '4. Security scan\n';
        content += '5. Deploy to environment\n\n';
      }
    }

    // Development Workflow
    content += '## Development Workflow\n\n';
    content += '1. **Setup**: Clone repository and install dependencies\n';
    content += '2. **Development**: Run local development server\n';
    content += '3. **Testing**: Write tests following TDD\n';
    content += '4. **Code Review**: Submit PR for review\n';
    content += '5. **Quality Assurance**: Automated QA checks\n';
    content += '6. **Deployment**: Auto-deploy on merge to main\n\n';

    // Next Steps
    content += '## Next Steps\n\n';
    content += '1. Review and refine this blueprint\n';
    content += '2. Create detailed API specifications (OpenAPI/Swagger)\n';
    content += '3. Design database schema in detail\n';
    content += '4. Set up development environment\n';
    content += '5. Implement authentication flow\n';
    content += '6. Begin feature development with TDD\n\n';

    // Notes
    content += '## Notes\n\n';
    content += '- This blueprint is a living document and should be updated as the project evolves\n';
    content += '- All technical decisions should be documented and reviewed\n';
    content += '- Follow security best practices for authentication and data handling\n';
    content += '- Maintain test coverage above 70% for all new code\n';

    return content;
  }

  async generateTemplates() {
    console.log('📄 Generating template files...\n');
    
    // Generate .gitignore
    this.generateGitignore();
    
    // Generate README.md
    this.generateReadme();
    
    // Generate environment template
    this.generateEnvTemplate();
    
    // Generate Docker files if needed
    if (this.config.deployment.docker) {
      this.generateDockerfiles();
    }
    
    // Generate CI/CD configuration if needed
    if (this.config.deployment.cicd) {
      this.generateCICD();
    }
    
    console.log('');
  }

  generateGitignore() {
    const ignorePatterns = [
      '# Dependencies',
      'node_modules/',
      'vendor/',
      '__pycache__/',
      '*.pyc',
      '',
      '# Environment',
      '.env',
      '.env.local',
      '.env.*.local',
      '',
      '# Build outputs',
      'dist/',
      'build/',
      '*.log',
      '',
      '# IDE',
      '.vscode/',
      '.idea/',
      '*.swp',
      '*.swo',
      '',
      '# OS',
      '.DS_Store',
      'Thumbs.db'
    ];
    
    fs.writeFileSync(
      path.join(this.projectDir, '.gitignore'),
      ignorePatterns.join('\n')
    );
    console.log('  ✓ Generated .gitignore');
  }

  generateReadme() {
    const readme = `# ${this.config.project.name}

${this.config.project.description}

## Overview

This project was initialized using GitHub Copilot Orchestra with architecture-first approach.

**Project Type:** ${this.config.project.type}
**Architecture:** ${this.config.architecture.pattern}

## Getting Started

### Prerequisites

- ${this.config.project.language === 'nodejs' ? 'Node.js 18+' : this.config.project.language}
${this.config.database.type !== 'none' ? `- ${this.config.database.type}` : ''}

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${this.config.project.name}

# Install dependencies
${this.config.project.language === 'nodejs' ? 'npm install' : 
  this.config.project.language === 'python' ? 'pip install -r requirements.txt' : 
  '# Install dependencies'}

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
\`\`\`

### Running Locally

\`\`\`bash
${this.config.project.language === 'nodejs' ? 'npm run dev' : 
  this.config.project.language === 'python' ? 'python app.py' : 
  '# Start the application'}
\`\`\`

## Documentation

- See [PROJECT-BLUEPRINT.md](PROJECT-BLUEPRINT.md) for detailed architecture
${this.config.apis.length > 0 ? '- API documentation available at `/api/docs` when running' : ''}

## Development

### Running Tests

\`\`\`bash
${this.config.project.language === 'nodejs' ? 'npm test' : 
  this.config.project.language === 'python' ? 'pytest' : 
  '# Run tests'}
\`\`\`

### Code Quality

\`\`\`bash
${this.config.project.language === 'nodejs' ? 'npm run lint' : 
  this.config.project.language === 'python' ? 'pylint src/' : 
  '# Run linter'}
\`\`\`

## Deployment

${this.config.deployment.docker ? `
### Docker

\`\`\`bash
docker-compose up
\`\`\`
` : ''}

${this.config.deployment.cicd ? `
### CI/CD

This project uses ${this.config.deployment.cicd} for continuous integration and deployment.
` : ''}

## License

[Your License Here]
`;

    fs.writeFileSync(
      path.join(this.projectDir, 'README.md'),
      readme
    );
    console.log('  ✓ Generated README.md');
  }

  generateEnvTemplate() {
    const envVars = this.config.environment.variables.map(v => 
      `# ${v.description}\n${v.name}=`
    ).join('\n\n');
    
    const template = `# Environment Configuration
# Copy this file to .env and fill in the values

${envVars}
`;

    fs.writeFileSync(
      path.join(this.projectDir, '.env.example'),
      template
    );
    console.log('  ✓ Generated .env.example');
  }

  generateDockerfiles() {
    // Simple Dockerfile - would be customized based on language
    let dockerfile = '';
    
    if (this.config.project.language === 'nodejs') {
      dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;
    } else if (this.config.project.language === 'python') {
      dockerfile = `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
`;
    }
    
    if (dockerfile) {
      fs.writeFileSync(
        path.join(this.projectDir, 'Dockerfile'),
        dockerfile
      );
      console.log('  ✓ Generated Dockerfile');
    }
    
    // Docker Compose
    const compose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
${this.config.database.type !== 'none' ? `
  db:
    image: ${this.config.database.type}:latest
    environment:
      - POSTGRES_DB=${this.config.project.name}
      - POSTGRES_USER=dev
      - POSTGRES_PASSWORD=devpass
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
` : ''}
`;
    
    fs.writeFileSync(
      path.join(this.projectDir, 'docker-compose.yml'),
      compose
    );
    console.log('  ✓ Generated docker-compose.yml');
  }

  generateCICD() {
    if (this.config.deployment.cicd === 'github-actions') {
      const workflow = `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Check coverage
      run: npm test -- --coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      run: echo "Deploy to production"
      # Add your deployment steps here
`;
      
      const workflowPath = path.join(this.projectDir, '.github', 'workflows');
      fs.mkdirSync(workflowPath, { recursive: true });
      fs.writeFileSync(
        path.join(workflowPath, 'ci-cd.yml'),
        workflow
      );
      console.log('  ✓ Generated .github/workflows/ci-cd.yml');
    }
  }

  async initializeGit() {
    console.log('🔧 Initializing Git repository...\n');
    
    try {
      process.chdir(this.projectDir);
      
      if (!fs.existsSync(path.join(this.projectDir, '.git'))) {
        execSync('git init', { stdio: 'pipe' });
        execSync('git add .', { stdio: 'pipe' });
        execSync('git commit -m "Initial commit: Project initialized with Copilot Orchestra"', { stdio: 'pipe' });
        console.log('  ✓ Git repository initialized\n');
      } else {
        console.log('  ℹ Git repository already exists\n');
      }
    } catch (error) {
      console.log(`  ⚠ Git initialization skipped: ${error.message}\n`);
    }
  }

  showCompletionMessage() {
    console.log('═'.repeat(70));
    console.log('\n🎉 Project initialization complete!\n');
    console.log(`✓ Project created at: ${this.projectDir}`);
    console.log('✓ Architecture blueprint generated');
    console.log('✓ Project structure created');
    console.log('✓ Template files generated');
    console.log('✓ Git repository initialized');
    
    console.log('\n📋 Next Steps:\n');
    console.log(`   cd ${this.projectName || '.'}`);
    console.log('   Review PROJECT-BLUEPRINT.md');
    console.log('   Set up environment variables in .env');
    console.log('   Start development with Copilot Orchestra Conductor\n');
    
    console.log('═'.repeat(70) + '\n');
  }

  // Helper methods
  prompt(question) {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }

  async confirm(question) {
    const answer = await this.prompt(question);
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
  }
}

// Main execution
if (require.main === module) {
  const projectName = process.argv[2];
  const wizard = new ProjectInitWizard(projectName);
  wizard.run().catch(console.error);
}

module.exports = ProjectInitWizard;
