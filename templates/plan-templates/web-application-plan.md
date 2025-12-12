# Web Application Plan Template

Use this template when planning a full-stack web application with frontend and backend.

## Plan: [Feature/Project Name]

[Brief description of what you're building - 1-3 sentences]

**Project Type:** Web Application
**Architecture Pattern:** Layered (Frontend + API + Database)

---

## Architecture Context

**From PROJECT-BLUEPRINT.md:**
- Frontend: [React/Vue/Angular/Next.js]
- Backend: [Node.js/Python/Java/Go]
- Database: [PostgreSQL/MySQL/MongoDB]
- Authentication: [JWT/OAuth/Session]
- Deployment: [Docker/Kubernetes/Cloud]

**System Components:**
- Frontend application (user interface)
- API layer (business logic)
- Database (data persistence)
- [Additional components: cache, queue, etc.]

---

## Phases

### Phase 1: Database Schema and Models
**Objective:** Set up database schema and data models

**Files/Functions to Modify/Create:**
- `prisma/schema.prisma` or `models/user.py` (define entities)
- `migrations/001_initial.sql` (database migrations)
- `src/models/` (model definitions)

**Tests to Write:**
- `test_user_model_creation` - Test user model creation
- `test_user_model_validation` - Test model validation
- `test_database_constraints` - Test unique constraints
- `test_relationships` - Test entity relationships

**Steps:**
1. Write tests for database models (failing)
2. Run tests to confirm they fail
3. Define database schema matching PROJECT-BLUEPRINT.md
4. Create migration files
5. Run migrations to create tables
6. Implement model classes/interfaces
7. Run tests to confirm they pass
8. Verify schema matches architectural design

---

### Phase 2: API Endpoints (CRUD Operations)
**Objective:** Implement REST API endpoints for core entities

**Files/Functions to Modify/Create:**
- `src/routes/users.ts` (route definitions)
- `src/controllers/users.controller.ts` (request handlers)
- `src/services/users.service.ts` (business logic)

**Tests to Write:**
- `test_get_users_list` - Test GET /api/users endpoint
- `test_create_user` - Test POST /api/users endpoint
- `test_get_user_by_id` - Test GET /api/users/:id endpoint
- `test_update_user` - Test PUT /api/users/:id endpoint
- `test_delete_user` - Test DELETE /api/users/:id endpoint
- `test_validation_errors` - Test input validation
- `test_not_found_errors` - Test 404 responses

**Steps:**
1. Write integration tests for API endpoints (failing)
2. Run tests to confirm they fail
3. Create route definitions matching API contracts from blueprint
4. Implement controller methods
5. Implement service layer business logic
6. Add input validation middleware
7. Run tests to confirm they pass
8. Verify endpoints match OpenAPI specification

---

### Phase 3: Authentication and Authorization
**Objective:** Implement user authentication with [JWT/OAuth/Session]

**Files/Functions to Modify/Create:**
- `src/routes/auth.ts` (auth routes)
- `src/services/auth.service.ts` (auth logic)
- `src/middleware/auth.middleware.ts` (JWT validation)
- `src/utils/jwt.util.ts` (token generation)

**Tests to Write:**
- `test_user_registration` - Test user signup
- `test_user_login_success` - Test login with valid credentials
- `test_user_login_invalid_password` - Test login with wrong password
- `test_jwt_token_generation` - Test token creation
- `test_jwt_token_validation` - Test token verification
- `test_protected_route_no_token` - Test 401 without token
- `test_protected_route_valid_token` - Test access with valid token
- `test_protected_route_expired_token` - Test 401 with expired token

**Steps:**
1. Write auth endpoint tests (failing)
2. Run tests to confirm they fail
3. Implement user registration endpoint
4. Implement password hashing (bcrypt)
5. Implement login endpoint
6. Implement JWT token generation
7. Create auth middleware for protected routes
8. Apply middleware to protected endpoints
9. Run tests to confirm they pass
10. Verify auth flow matches security design from blueprint

---

### Phase 4: Frontend Components and State Management
**Objective:** Build React components and set up state management

**Files/Functions to Modify/Create:**
- `src/components/LoginForm.tsx` (login component)
- `src/components/UserList.tsx` (user list component)
- `src/hooks/useAuth.ts` (auth hook)
- `src/context/AuthContext.tsx` (auth context)
- `src/services/api.ts` (API client)

**Tests to Write:**
- `test_login_form_renders` - Test component renders
- `test_login_form_submission` - Test form submission
- `test_login_form_validation` - Test client-side validation
- `test_user_list_renders` - Test list component
- `test_user_list_loading` - Test loading state
- `test_auth_context_provides_user` - Test auth context
- `test_api_client_includes_token` - Test auth header

**Steps:**
1. Write component tests (failing)
2. Run tests to confirm they fail
3. Create API client service with auth headers
4. Implement auth context and provider
5. Create login form component
6. Create user list component
7. Implement auth hook
8. Add loading and error states
9. Run tests to confirm they pass
10. Verify UI/UX matches design requirements

---

### Phase 5: Integration and Error Handling
**Objective:** Connect frontend to backend, add comprehensive error handling

**Files/Functions to Modify/Create:**
- `src/middleware/error.middleware.ts` (error handler)
- `src/utils/errors.ts` (custom error classes)
- `src/components/ErrorBoundary.tsx` (React error boundary)
- `src/hooks/useApi.ts` (API hook with error handling)

**Tests to Write:**
- `test_api_error_handling` - Test API error responses
- `test_network_error_handling` - Test network failures
- `test_error_boundary_catches_errors` - Test error boundary
- `test_validation_error_display` - Test validation errors shown
- `test_unauthorized_redirect` - Test redirect on 401
- `test_server_error_display` - Test 500 error handling

**Steps:**
1. Write error handling tests (failing)
2. Run tests to confirm they fail
3. Create custom error classes
4. Implement centralized error middleware
5. Add error boundary to React app
6. Implement API error handling in frontend
7. Add user-friendly error messages
8. Handle edge cases (network failures, timeouts)
9. Run tests to confirm they pass
10. Verify error handling is user-friendly

---

### Phase 6: Deployment Configuration
**Objective:** Set up Docker and CI/CD pipeline

**Files/Functions to Modify/Create:**
- `Dockerfile` (container configuration)
- `docker-compose.yml` (multi-container setup)
- `.github/workflows/ci.yml` (CI/CD pipeline)
- `.env.example` (environment template)

**Tests to Write:**
- Manual validation: Docker build succeeds
- Manual validation: Docker Compose starts all services
- Manual validation: CI pipeline runs all checks
- Manual validation: Deployment to staging works

**Steps:**
1. Create Dockerfile for frontend
2. Create Dockerfile for backend
3. Create docker-compose.yml with all services
4. Set up GitHub Actions workflow
5. Add linting step to CI
6. Add testing step to CI
7. Add build step to CI
8. Configure deployment step
9. Test full CI/CD pipeline
10. Verify deployment matches blueprint deployment strategy

---

## Open Questions

1. **State Management**: Use Context API, Redux, or Zustand? Recommend: Context for simple auth, Redux for complex state
2. **API Pagination**: Use offset or cursor-based? Recommend: Offset for simple lists, cursor for infinite scroll
3. **File Uploads**: Handle in API or separate service? Recommend: API for small files, S3/Cloud Storage for large
4. **Real-time Features**: Use WebSockets, Server-Sent Events, or polling? Recommend: Based on use case
5. **Error Tracking**: Integrate Sentry or similar? Recommend: Yes for production

---

## Notes

- Follow TDD strictly: tests first, minimal code, refactor
- Each phase should be independently committable
- Refer to PROJECT-BLUEPRINT.md for architectural decisions
- Ensure all security requirements from blueprint are met
- Keep test coverage above 70%
- Update API documentation as endpoints are added
