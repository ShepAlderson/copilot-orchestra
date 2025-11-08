# Architecture Planning Guide

This guide describes how to approach software development with architecture-first planning in GitHub Copilot Orchestra.

## Philosophy

**Architecture-first planning** means making key technical decisions upfront, before writing code. This approach:

- ✅ **Prevents costly refactoring** - Get the structure right from the start
- ✅ **Enables better estimates** - Understand complexity before building
- ✅ **Improves team alignment** - Everyone understands the system design
- ✅ **Facilitates quality** - Architecture decisions guide implementation patterns
- ✅ **Reduces technical debt** - Intentional design over emergent chaos

## Architecture-First Workflow

```
1. Capture Requirements
   ↓
2. Design System Architecture
   ↓
3. Define API Contracts
   ↓
4. Plan Data Models
   ↓
5. Identify Security Needs
   ↓
6. Plan Deployment Strategy
   ↓
7. Document in PROJECT-BLUEPRINT.md
   ↓
8. Create Implementation Plan
   ↓
9. Implement with TDD
   ↓
10. Deploy
```

## Step 1: Capture Requirements

### Functional Requirements
- What does the system need to do?
- What features are needed?
- What user stories drive the design?

### Non-Functional Requirements
- Performance targets (response time, throughput)
- Scalability needs (users, data volume)
- Availability requirements (uptime %)
- Security requirements (compliance, data protection)
- Maintainability goals (team size, expertise)

### Tools
- Use `tools/project-init.js` to capture requirements interactively
- Creates initial PROJECT-BLUEPRINT.md

## Step 2: Design System Architecture

### Choose Architecture Pattern

**Monolithic:**
- Single deployable unit
- Shared database
- Simple deployment
- Good for: Small teams, simple apps, MVPs

**Microservices:**
- Independent services
- Service per business capability
- Independent deployment
- Good for: Large teams, complex domains, scalability

**Serverless:**
- Function as a service
- Event-driven
- Pay per use
- Good for: Variable load, event processing, cost optimization

**Layered (MVC/3-tier):**
- Presentation, business logic, data layers
- Clear separation of concerns
- Good for: Web applications, traditional systems

### Identify Components

For each component, define:
- **Purpose**: What does it do?
- **Responsibilities**: What is it responsible for?
- **Dependencies**: What does it depend on?
- **Interfaces**: How does it communicate?

### Example Component Breakdown

```
Web Application:
├── Frontend (React)
│   ├── Components
│   ├── State Management
│   └── API Client
├── API Gateway (Express)
│   ├── Authentication
│   ├── Rate Limiting
│   └── Request Routing
├── Business Services
│   ├── User Service
│   ├── Order Service
│   └── Payment Service
└── Data Layer
    ├── PostgreSQL
    └── Redis Cache
```

## Step 3: Define API Contracts

### RESTful API Design

**Resource-Oriented URLs:**
```
GET    /api/v1/users           - List users
POST   /api/v1/users           - Create user
GET    /api/v1/users/{id}      - Get user
PUT    /api/v1/users/{id}      - Update user
DELETE /api/v1/users/{id}      - Delete user
```

**HTTP Methods:**
- `GET` - Retrieve (idempotent, safe)
- `POST` - Create (not idempotent)
- `PUT` - Update (idempotent)
- `PATCH` - Partial update (not idempotent)
- `DELETE` - Delete (idempotent)

**Status Codes:**
- `200` OK - Success
- `201` Created - Resource created
- `400` Bad Request - Invalid input
- `401` Unauthorized - Authentication required
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource doesn't exist
- `500` Internal Server Error - Server error

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### API Versioning

**URL Versioning (Recommended):**
```
/api/v1/users
/api/v2/users
```

**Header Versioning:**
```
Accept: application/vnd.api+json; version=1
```

### Document API Contracts

Use OpenAPI/Swagger specification:
```yaml
paths:
  /api/v1/users:
    get:
      summary: List all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
```

## Step 4: Plan Data Models

### Entity Identification

Identify core entities:
- **Users** - Who uses the system
- **Resources** - What the system manages
- **Relationships** - How entities relate

### Database Design

**Relational (PostgreSQL, MySQL):**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
```

**Document (MongoDB):**
```javascript
{
  _id: ObjectId,
  email: String,
  profile: {
    firstName: String,
    lastName: String
  },
  posts: [{
    title: String,
    content: String,
    createdAt: Date
  }]
}
```

### Schema Migrations

Plan for schema evolution:
- Use migration tools (Alembic, Prisma, TypeORM)
- Version all schema changes
- Make migrations reversible
- Test migrations on copy of production data

## Step 5: Identify Security Needs

### Authentication

Choose authentication method:
- **JWT** - Stateless, scalable, good for APIs
- **Session** - Stateful, traditional, good for web apps
- **OAuth 2.0** - Delegated authorization, social login
- **API Keys** - Simple, good for service-to-service

### Authorization

**Role-Based Access Control (RBAC):**
```
Roles:
- Admin: Full access
- User: Own resources only
- Guest: Read-only public resources
```

**Attribute-Based Access Control (ABAC):**
```
Rules:
- User can edit post if user.id == post.author_id
- User can view post if post.visibility == "public" OR user.id == post.author_id
```

### Security Checklist

- [ ] Input validation on all endpoints
- [ ] Output encoding to prevent XSS
- [ ] SQL injection prevention (use ORMs or parameterized queries)
- [ ] CSRF protection for state-changing operations
- [ ] Rate limiting to prevent brute force
- [ ] HTTPS/TLS encryption in transit
- [ ] Secrets in environment variables, never in code
- [ ] Password hashing (bcrypt, argon2)
- [ ] Token expiration and refresh
- [ ] Security headers (Helmet.js, etc.)
- [ ] CORS properly configured
- [ ] Dependency vulnerability scanning

## Step 6: Plan Deployment Strategy

### Environment Strategy

**Three Environments:**
- **Development** - Local development, frequent changes
- **Staging** - Pre-production, testing, QA
- **Production** - Live system, stable

**Configuration Management:**
```
.env.development
.env.staging
.env.production
```

### Deployment Targets

**Containerization (Docker):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Orchestration (Kubernetes):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
      - name: api
        image: myapp:1.0.0
        ports:
        - containerPort: 3000
```

**Cloud Platforms:**
- AWS: EC2, ECS, EKS, Lambda
- Azure: App Service, Container Instances, AKS
- GCP: Compute Engine, Cloud Run, GKE

### CI/CD Pipeline

```yaml
Pipeline Stages:
1. Lint → Check code quality
2. Test → Run test suite
3. Build → Build artifacts
4. Security Scan → Check vulnerabilities
5. Deploy to Staging → Auto-deploy for testing
6. Integration Tests → E2E tests on staging
7. Deploy to Production → Manual approval + deploy
```

## Step 7: Document in PROJECT-BLUEPRINT.md

### Blueprint Structure

```markdown
# Project Blueprint

## Project Overview
- Type, language, framework

## System Architecture
- Architecture diagram
- Components and responsibilities

## Technical Stack
- Backend, frontend, database, cache, etc.

## API Endpoints
- Table of all endpoints with methods, auth

## Database Schema
- Entity relationships
- Table definitions

## Authentication & Authorization
- Methods, tokens, roles

## Environment Configuration
- Required environment variables

## Deployment
- Target platforms, CI/CD

## Development Workflow
- Setup, testing, deployment process

## Next Steps
- Actionable items for implementation
```

Use `tools/project-init.js` to generate automatically.

## Step 8: Create Implementation Plan

### Plan Structure

Break work into phases:

```markdown
## Plan: Feature Implementation

### Phase 1: Database Setup
- Create database schema
- Write migrations
- Add seed data
- Test: Verify schema created correctly

### Phase 2: API Endpoints
- Implement CRUD endpoints
- Add validation middleware
- Test: All endpoints return correct responses

### Phase 3: Authentication
- Implement JWT generation
- Add auth middleware
- Test: Protected endpoints require valid token

### Phase 4: Business Logic
- Implement core features
- Add error handling
- Test: Edge cases handled correctly

### Phase 5: Integration
- Connect frontend to API
- Add error handling
- Test: End-to-end flows work
```

### Conductor Integration

The Conductor agent automatically:
1. Reads PROJECT-BLUEPRINT.md
2. Uses architecture to guide plan creation
3. Ensures implementation matches design
4. Validates API contracts are followed
5. Checks security requirements are met

### Planning Subagent Enhancement

The planning-subagent now:
1. Looks for PROJECT-BLUEPRINT.md first
2. Uses architecture to inform research
3. Suggests implementations matching design
4. Identifies architectural conflicts
5. Recommends patterns from blueprint

## Step 9: Implement with TDD

### Test-Driven Development

For each phase:
1. **Write failing test** - Define expected behavior
2. **Run test (should fail)** - Confirm test is valid
3. **Write minimal code** - Make test pass
4. **Run test (should pass)** - Confirm implementation works
5. **Refactor** - Improve code quality
6. **Repeat** - Next feature

### Architecture-Driven TDD

Tests should validate architecture:
- **API contracts** - Test endpoint behavior matches spec
- **Data models** - Test schema matches design
- **Security** - Test authentication/authorization
- **Integration** - Test components interact correctly

## Step 10: Deploy

### Deployment Checklist

- [ ] All tests pass (unit, integration, E2E)
- [ ] Linting passes with zero errors
- [ ] Security scan shows no vulnerabilities
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Health checks working
- [ ] Monitoring and logging set up
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] Load testing completed (if needed)
- [ ] Documentation updated

### Zero-Downtime Deployment

**Rolling Update:**
```
1. Deploy new version to subset of servers
2. Health check new version
3. Route traffic to new version
4. Deploy to remaining servers
5. Monitor for issues
```

**Blue-Green Deployment:**
```
1. Deploy new version to "green" environment
2. Test green environment
3. Switch traffic from "blue" to "green"
4. Keep blue as rollback option
```

## Architecture Patterns by Project Type

### Web Application (Frontend + Backend)

**Architecture:** Layered (3-tier)
```
Frontend (React/Vue/Angular)
    ↓
API Layer (Express/FastAPI)
    ↓
Business Logic
    ↓
Data Layer (PostgreSQL)
```

**Key Decisions:**
- State management (Redux, Context, Zustand)
- API communication (REST, GraphQL)
- Authentication (JWT, session)
- Deployment (Vercel, Netlify, AWS)

### REST API Service

**Architecture:** Layered with domain services
```
Routes → Controllers → Services → Repositories → Database
```

**Key Decisions:**
- API versioning strategy
- Authentication method
- Rate limiting approach
- Documentation (OpenAPI)

### Microservices

**Architecture:** Service-oriented
```
API Gateway
    ↓
├── Auth Service
├── User Service
├── Order Service
└── Payment Service
```

**Key Decisions:**
- Service communication (REST, gRPC, message queue)
- Service discovery
- Distributed tracing
- Data consistency strategy

### CLI Tool

**Architecture:** Command-driven
```
CLI Parser → Command Handlers → Core Logic → Output
```

**Key Decisions:**
- Argument parsing library
- Configuration management
- Output formatting
- Distribution method

## Best Practices

### 1. Start Simple

- Don't over-architect
- Add complexity when needed
- Prefer proven patterns
- YAGNI (You Aren't Gonna Need It)

### 2. Document Decisions

- Record why, not just what
- Link to resources and examples
- Update as architecture evolves
- Use Architecture Decision Records (ADRs)

### 3. Consider Constraints

- Team size and expertise
- Budget and timeline
- Performance requirements
- Compliance needs

### 4. Plan for Change

- Keep coupling low
- Use interfaces and abstractions
- Design for testability
- Make deployment easy

### 5. Security by Design

- Never add security as an afterthought
- Plan authentication from the start
- Validate all inputs
- Encrypt sensitive data

## Common Mistakes to Avoid

❌ **Starting coding before architecture**
✅ Design first, then implement

❌ **Copying architecture from different problem domain**
✅ Choose patterns that fit your specific needs

❌ **Not documenting decisions**
✅ Maintain PROJECT-BLUEPRINT.md as living document

❌ **Ignoring non-functional requirements**
✅ Plan for performance, security, scalability upfront

❌ **Over-engineering for future needs**
✅ Build for today's requirements, design for tomorrow's

❌ **Skipping API contract definition**
✅ Define API contracts before implementation

❌ **Not involving team in architecture decisions**
✅ Collaborate on architecture, get buy-in

## Tools and Resources

### Architecture Tools
- **Diagrams**: Mermaid, Lucidchart, draw.io
- **API Design**: OpenAPI/Swagger Editor
- **Database Design**: dbdiagram.io, DrawSQL
- **Architecture Docs**: PROJECT-BLUEPRINT.md template

### Copilot Orchestra Tools
- `tools/project-init.js` - Interactive architecture wizard
- `tools/blueprint-generator.js` - Generate from existing code
- `templates/project-blueprints/` - Example blueprints
- `templates/plan-templates/` - Planning templates

### Learning Resources
- [C4 Model](https://c4model.com/) - Architecture diagrams
- [12 Factor App](https://12factor.net/) - Best practices
- [REST API Design](https://restfulapi.net/) - API patterns
- [Database Design](https://www.postgresql.org/docs/) - Schema design

## Summary

Architecture-first planning with GitHub Copilot Orchestra:

1. ✅ Use `tools/project-init.js` to capture requirements
2. ✅ Generate PROJECT-BLUEPRINT.md with architecture
3. ✅ Define API contracts and data models
4. ✅ Planning-subagent reads blueprint automatically
5. ✅ Conductor ensures implementation follows architecture
6. ✅ QA subagent validates against architectural standards
7. ✅ Deploy with confidence knowing design is sound

**Result:** High-quality, maintainable systems built with intentional design.
