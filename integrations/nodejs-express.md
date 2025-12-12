# Node.js/Express Integration Guide

Integration guide for using GitHub Copilot Orchestra with Node.js and Express framework.

## Overview

Express's minimalist approach makes it perfect for Orchestra's incremental development:
- Simple routing structure
- Middleware-based architecture
- Extensive testing ecosystem
- Clear separation of concerns

## Quick Setup

```bash
# Initialize project
npm init -y

# Install dependencies
npm install express
npm install --save-dev jest supertest @types/express @types/jest ts-node typescript

# Initialize TypeScript
npx tsc --init

# Configure package.json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node src/server.ts",
    "test": "jest",
    "build": "tsc",
    "lint": "eslint . --ext .ts"
  }
}
```

## Project Structure

```
src/
├── server.ts           # Entry point
├── app.ts              # Express app setup
├── routes/             # Route definitions
│   ├── users.ts
│   └── auth.ts
├── controllers/        # Route handlers
│   ├── userController.ts
│   └── authController.ts
├── middleware/         # Custom middleware
│   ├── auth.ts
│   └── errorHandler.ts
├── models/             # Data models
│   └── User.ts
└── __tests__/          # Tests
    ├── routes/
    └── controllers/
```

## Agent Configuration

Add to Conductor.agent.md:

```markdown
<express_conventions>
- Use async/await for async operations
- Implement error handling middleware
- Validate request data with middleware (e.g., express-validator)
- Use proper HTTP status codes
- Follow REST API conventions
- Write integration tests using supertest
- Use environment variables for configuration
</express_conventions>
```

## Common Patterns

### Pattern 1: REST API Endpoint

**Request:**
```
Create a REST API endpoint for user management.
Include GET (list), GET (single), POST (create), PUT (update), DELETE.
```

**Plan:**
- Phase 1: Route definitions and validation middleware
- Phase 2: Controller implementation
- Phase 3: Error handling and tests

### Pattern 2: Authentication Middleware

**Request:**
```
Add JWT authentication middleware.
Include token generation, validation, and refresh.
```

**Plan:**
- Phase 1: JWT utility functions and tests
- Phase 2: Auth middleware implementation
- Phase 3: Integration with routes

## Example: User API Endpoint

### Phase 1: Tests First

```typescript
// __tests__/routes/users.test.ts
import request from 'supertest'
import app from '../../app'

describe('User API', () => {
  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)
      
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const newUser = {
        email: 'test@example.com',
        name: 'Test User'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
      
      expect(response.body).toHaveProperty('id')
      expect(response.body.email).toBe(newUser.email)
    })

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/users')
        .send({})
        .expect(400)
    })
  })
})
```

### Phase 2: Implementation

```typescript
// routes/users.ts
import { Router } from 'express'
import { body } from 'express-validator'
import * as userController from '../controllers/userController'
import { validate } from '../middleware/validation'

const router = Router()

router.get('/', userController.getUsers)

router.post(
  '/',
  [
    body('email').isEmail(),
    body('name').trim().notEmpty(),
    validate
  ],
  userController.createUser
)

router.get('/:id', userController.getUserById)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export default router
```

```typescript
// controllers/userController.ts
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

// ... other controllers
```

## Testing Strategies

### Integration Tests

```typescript
import request from 'supertest'
import app from '../app'

describe('Integration Tests', () => {
  beforeEach(async () => {
    // Setup test database
  })

  afterEach(async () => {
    // Cleanup
  })

  it('should handle complete user workflow', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test' })
    
    expect(createRes.status).toBe(201)
    const userId = createRes.body.id

    // Read
    const getRes = await request(app).get(`/api/users/${userId}`)
    expect(getRes.status).toBe(200)

    // Update
    const updateRes = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: 'Updated' })
    expect(updateRes.status).toBe(200)

    // Delete
    const deleteRes = await request(app).delete(`/api/users/${userId}`)
    expect(deleteRes.status).toBe(204)
  })
})
```

### Unit Tests

```typescript
import * as userController from '../controllers/userController'

describe('User Controller', () => {
  it('should handle errors gracefully', async () => {
    const mockReq = {} as Request
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response
    const mockNext = jest.fn()

    await userController.getUsers(mockReq, mockRes, mockNext)
    
    expect(mockNext).toHaveBeenCalled()
  })
})
```

## Tips & Tricks

### Error Handling

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)
  
  res.status(500).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}

// app.ts
app.use(errorHandler)
```

### Request Validation

```typescript
import { validationResult } from 'express-validator'

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
```

### Async Error Handling

```typescript
// Wrap async routes
const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Usage
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAll()
  res.json(users)
}))
```

## Common Issues

**Issue:** Tests hang indefinitely  
**Solution:** Close database connections in afterAll hook

**Issue:** Port already in use  
**Solution:** Use dynamic port in tests or close server properly

**Issue:** CORS errors  
**Solution:** Install and configure cors middleware

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supertest](https://github.com/visionmedia/supertest)
- [express-validator](https://express-validator.github.io/)

---

**Questions?** Open an issue or discussion!
