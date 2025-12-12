# REST API Service - Project Blueprint

> Example blueprint for a REST API service with authentication and database

**Generated:** 2025-11-08

## Project Overview

- **Type:** REST API Service
- **Primary Language:** Node.js (TypeScript)
- **Architecture Pattern:** Layered (3-tier)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    System Architecture                      │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │ API Gateway  │
                    │  (Express)   │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │ Middleware   │
                    │ Auth/Logging │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │ Controllers  │
                    │ (Routes)     │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │  Services    │
                    │(Business     │
                    │ Logic)       │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │ Repositories │
                    │(Data Access) │
                    └───────┬──────┘
                            │
                    ┌───────▼──────┐
                    │  PostgreSQL  │
                    │  Database    │
                    └──────────────┘
```

### System Components

- **API Gateway**: Express.js server handling HTTP requests
- **Middleware Layer**: Authentication, validation, logging, error handling
- **Controllers**: Route handlers mapping HTTP endpoints to services
- **Services**: Business logic and orchestration
- **Repositories**: Data access layer abstracting database operations
- **Database**: PostgreSQL for persistent storage

## Technical Stack

- **Backend:** Node.js 18+ with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **Cache:** Redis
- **ORM:** Prisma or TypeORM
- **Authentication:** JWT (JSON Web Tokens)
- **API Documentation:** OpenAPI/Swagger
- **Testing:** Jest + Supertest
- **Linting:** ESLint + Prettier

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/auth/register | Register new user | — |
| POST | /api/v1/auth/login | Login and get JWT token | — |
| POST | /api/v1/auth/refresh | Refresh JWT token | ✓ |
| GET | /api/v1/users/me | Get current user profile | ✓ |
| PUT | /api/v1/users/me | Update current user profile | ✓ |
| GET | /api/v1/users/:id | Get user by ID | ✓ |
| GET | /api/v1/resources | List all resources | ✓ |
| POST | /api/v1/resources | Create new resource | ✓ |
| GET | /api/v1/resources/:id | Get resource by ID | ✓ |
| PUT | /api/v1/resources/:id | Update resource | ✓ |
| DELETE | /api/v1/resources/:id | Delete resource | ✓ |

**API Versioning:** Enabled (v1 in URL path)

**Rate Limiting:** 100 requests per 15 minutes per IP

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "timestamp": "2025-11-08T00:00:00Z"
}
```

**Error Format:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": []
  },
  "timestamp": "2025-11-08T00:00:00Z"
}
```

## Database Schema

### Entities

#### users

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| role | ENUM | NOT NULL, DEFAULT 'user' |
| is_active | BOOLEAN | DEFAULT true |
| email_verified | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |
| last_login_at | TIMESTAMP | |

#### resources

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY → users.id |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| status | ENUM | NOT NULL, DEFAULT 'draft' |
| metadata | JSONB | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

#### refresh_tokens

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY → users.id |
| token | VARCHAR(500) | UNIQUE, NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

**Database Migrations:** Enabled (using Prisma Migrate or TypeORM migrations)

**Indexes:**
- `users.email` (unique)
- `resources.user_id`
- `resources.created_at`
- `refresh_tokens.token` (unique)
- `refresh_tokens.user_id`

## Authentication & Authorization

- **Method:** JWT (JSON Web Tokens)
- **Token Lifetime:** 
  - Access Token: 15 minutes
  - Refresh Token: 7 days
- **Password Security:** bcrypt with 10 rounds
- **Access Control:** Role-Based (RBAC)
- **Roles:** admin, user, guest

**JWT Payload:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1699401600,
  "exp": 1699402500
}
```

**Protected Routes:**
- All `/api/v1/*` routes except `/auth/register` and `/auth/login`
- Authorization header required: `Bearer <token>`
- Role-based permissions checked in middleware

## Environment Configuration

### Required Environment Variables

- **NODE_ENV**: Environment (development/staging/production)
- **PORT**: Server port (default: 3000)
- **DATABASE_URL**: PostgreSQL connection string
- **REDIS_URL**: Redis connection string
- **JWT_SECRET**: Secret key for JWT signing
- **JWT_REFRESH_SECRET**: Secret key for refresh token signing
- **CORS_ORIGIN**: Allowed CORS origins
- **LOG_LEVEL**: Logging level (debug/info/warn/error)
- **RATE_LIMIT_WINDOW**: Rate limit window in minutes
- **RATE_LIMIT_MAX**: Max requests per window

### Environments

- **development**: Local development with hot reload
- **staging**: Pre-production testing environment
- **production**: Live production environment

**Environment-specific configurations:**
- Development: Verbose logging, no rate limiting
- Staging: Production-like with test data
- Production: Optimized, strict rate limits, minimal logging

## Deployment

**Target Platforms:** Docker, Kubernetes, AWS

### Docker

The project includes:
- `Dockerfile` for containerization (multi-stage build)
- `docker-compose.yml` for local development (app + PostgreSQL + Redis)
- `.dockerignore` to exclude unnecessary files

**Docker Commands:**
```bash
# Build
docker build -t api-service .

# Run
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

Manifests included:
- `k8s/deployment.yml` - Application deployment
- `k8s/service.yml` - Service configuration
- `k8s/ingress.yml` - Ingress routing
- `k8s/configmap.yml` - Configuration
- `k8s/secrets.yml` - Secrets (template)

**Deploy to Kubernetes:**
```bash
kubectl apply -f k8s/
```

### CI/CD Pipeline

**Platform:** GitHub Actions

Pipeline stages:
1. **Lint and Format**: ESLint and Prettier checks
2. **Type Check**: TypeScript compilation
3. **Unit Tests**: Jest tests with coverage
4. **Integration Tests**: API endpoint tests
5. **Security Scan**: npm audit and OWASP checks
6. **Build Docker Image**: Multi-stage build
7. **Push to Registry**: Docker Hub or ECR
8. **Deploy**: Deploy to staging/production

**Deployment Strategy:**
- Staging: Auto-deploy on push to `develop`
- Production: Auto-deploy on push to `main` (with approval)
- Rolling updates with zero downtime

## Development Workflow

### Setup

```bash
# Clone and install
git clone <repo-url>
cd api-service
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start database
docker-compose up -d postgres redis

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed
```

### Development

```bash
# Start dev server (hot reload)
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linter
npm run lint

# Format code
npm run format
```

### Testing Strategy

- **Unit Tests**: Test individual functions/classes
- **Integration Tests**: Test API endpoints end-to-end
- **Coverage Target**: ≥ 80%
- **Test Data**: Separate test database with fixtures

### Code Quality

- ESLint configuration with TypeScript support
- Prettier for consistent formatting
- Husky for pre-commit hooks
- Conventional commits enforced

## Security Considerations

- ✅ Input validation on all endpoints (using Joi or Zod)
- ✅ SQL injection prevention (parameterized queries via ORM)
- ✅ XSS protection (sanitize user inputs)
- ✅ CSRF protection (SameSite cookies, CSRF tokens)
- ✅ Rate limiting (prevent brute force attacks)
- ✅ Helmet.js for security headers
- ✅ CORS properly configured
- ✅ Secrets not in code (environment variables)
- ✅ HTTPS enforced in production
- ✅ Password complexity requirements
- ✅ JWT token expiration
- ✅ Refresh token rotation

## Monitoring & Logging

- **Logging:** Winston or Pino structured logging
- **Monitoring:** Application metrics and health checks
- **Error Tracking:** Sentry integration
- **APM:** New Relic or DataDog (optional)

**Log Levels:**
- ERROR: Application errors
- WARN: Warnings and deprecations
- INFO: General information
- DEBUG: Detailed debugging (dev only)

**Health Check Endpoint:**
- `GET /health` - Returns server status and dependencies

## Next Steps

1. ✅ Review and refine this blueprint
2. ⏳ Set up development environment
3. ⏳ Initialize TypeScript + Express project
4. ⏳ Set up database with Prisma/TypeORM
5. ⏳ Implement authentication flow (register/login/refresh)
6. ⏳ Create base CRUD operations for resources
7. ⏳ Add comprehensive tests (unit + integration)
8. ⏳ Set up CI/CD pipeline
9. ⏳ Generate OpenAPI documentation
10. ⏳ Deploy to staging environment

## Notes

- This blueprint should be updated as the project evolves
- All API changes must be documented in OpenAPI spec
- Follow RESTful conventions for endpoint design
- Maintain backward compatibility or version APIs properly
- Security reviews required for auth-related changes
- Database migrations must be reversible
- Test coverage must stay above 80%
- All environment variables must be documented

## References

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [REST API Design Guide](https://restfulapi.net/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
