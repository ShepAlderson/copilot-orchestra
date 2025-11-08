# Node.js + Express API Template

Complete REST API template with Express, TypeScript, testing, authentication, and deployment configuration.

## Features

- 🚀 **Express.js** with TypeScript
- 🔐 **JWT Authentication** built-in
- 🗄️ **Prisma ORM** with PostgreSQL
- 🧪 **Jest + Supertest** for testing
- ✅ **ESLint + Prettier** for code quality
- 📝 **OpenAPI/Swagger** documentation
- 🐳 **Docker** and Docker Compose
- 🔄 **GitHub Actions** CI/CD
- 🛡️ **Security** best practices (Helmet, CORS, rate limiting)

## Project Structure

```
nodejs-api/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   └── logger.util.ts
│   ├── types/
│   │   └── index.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   └── user.test.ts
│   ├── unit/
│   │   ├── services/
│   │   │   └── auth.service.test.ts
│   │   └── utils/
│   │       └── jwt.util.test.ts
│   └── setup.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── .eslintrc.js
├── .prettierrc
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
├── tsconfig.json
├── swagger.json
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Installation

```bash
# Create new project from template
npx degit copilot-orchestra/templates/project-types/nodejs-api my-api
cd my-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL (using Docker)
docker-compose up -d postgres

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Development

```bash
# Start dev server with hot reload (http://localhost:3000)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Generate Prisma Client
npx prisma db seed         # Seed database
```

## Configuration Files

### package.json

```json
{
  "name": "nodejs-api",
  "version": "1.0.0",
  "description": "Express TypeScript API with authentication",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src tests --ext .ts",
    "lint:fix": "eslint src tests --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"tests/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts"
  },
  "keywords": ["express", "typescript", "api", "rest"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "bcrypt": "^5.1.1",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.10.5",
    "@types/supertest": "^6.0.2",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "jest": "^29.7.0",
    "prettier": "^3.1.1",
    "prisma": "^5.7.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["node", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  firstName     String?   @map("first_name")
  lastName      String?   @map("last_name")
  role          Role      @default(USER)
  isActive      Boolean   @default(true) @map("is_active")
  emailVerified Boolean   @default(false) @map("email_verified")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  lastLoginAt   DateTime? @map("last_login_at")

  refreshTokens RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("refresh_tokens")
}

enum Role {
  ADMIN
  USER
  GUEST
}
```

### .eslintrc.js

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

### jest.config.js

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Copy built app
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start app
CMD ["node", "dist/server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: apidb
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/apidb
      - JWT_SECRET=your-secret-key-change-in-production
      - JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  dev:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/apidb
      - JWT_SECRET=dev-secret-key
      - JWT_REFRESH_SECRET=dev-refresh-secret-key
    command: npm run dev
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

### .env.example

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/apidb

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
```

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Run tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          JWT_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Build
        run: npm run build

      - name: Build Docker image
        run: docker build -t nodejs-api .
```

## API Endpoints

### Authentication

```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login and get tokens
POST   /api/v1/auth/refresh      - Refresh access token
POST   /api/v1/auth/logout       - Logout (invalidate refresh token)
```

### Users

```
GET    /api/v1/users/me          - Get current user profile
PUT    /api/v1/users/me          - Update current user profile
GET    /api/v1/users/:id         - Get user by ID (admin only)
GET    /api/v1/users             - List all users (admin only)
DELETE /api/v1/users/:id         - Delete user (admin only)
```

### Health

```
GET    /health                   - Health check endpoint
```

## Example Code

### src/controllers/auth.controller.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await authService.register({ email, password, firstName, lastName });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

### tests/integration/auth.test.ts

```typescript
import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
    });

    it('should return 409 if email already exists', async () => {
      await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'Password123!',
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'Password123!',
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
    });
  });
});
```

## Security Features

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **Rate Limiting** - Prevent brute force attacks
- ✅ **JWT** - Secure token-based authentication
- ✅ **bcrypt** - Password hashing
- ✅ **Input Validation** - Joi validation
- ✅ **SQL Injection** - Prevented by Prisma ORM
- ✅ **Environment Variables** - Secrets not in code

## Best Practices

### Code Organization

- Follow MVC pattern (routes → controllers → services)
- Keep controllers thin, business logic in services
- Use middleware for cross-cutting concerns
- Separate concerns (auth, validation, error handling)

### Testing

- Write integration tests for API endpoints
- Write unit tests for services and utilities
- Test error cases and edge cases
- Maintain 70%+ code coverage

### Error Handling

- Use centralized error handling middleware
- Return consistent error responses
- Log errors properly
- Never expose sensitive information in errors

### Database

- Use migrations for schema changes
- Index frequently queried fields
- Use transactions for data consistency
- Clean up old refresh tokens periodically

## Deployment

### Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

### Heroku

```bash
heroku create my-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run npx prisma migrate deploy
```

### AWS/Cloud

- Use environment variables for configuration
- Set up health checks
- Configure auto-scaling
- Use managed PostgreSQL (RDS, Cloud SQL, etc.)

## License

MIT
