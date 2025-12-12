# Python + FastAPI Service Template

Complete FastAPI service template with authentication, database, testing, and deployment configuration.

## Features

- ⚡ **FastAPI** - Modern, fast web framework
- 🔐 **JWT Authentication** built-in
- 🗄️ **SQLAlchemy** with PostgreSQL
- 🧪 **pytest** for testing
- ✅ **Black + Pylint + isort** for code quality
- 📝 **OpenAPI/Swagger** auto-generated docs
- 🐳 **Docker** and Docker Compose
- 🔄 **GitHub Actions** CI/CD
- 🛡️ **Security** best practices (CORS, rate limiting)

## Project Structure

```
python-service/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   └── users.py
│   │   │   ├── __init__.py
│   │   │   └── router.py
│   │   └── deps.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── token.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   └── user_service.py
│   ├── __init__.py
│   └── main.py
├── tests/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   └── test_users.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── test_auth_service.py
│   ├── __init__.py
│   ├── conftest.py
│   └── test_main.py
├── alembic/
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
├── .github/
│   └── workflows/
│       └── ci.yml
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── alembic.ini
├── pyproject.toml
├── requirements.txt
├── requirements-dev.txt
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Docker (optional)

### Installation

```bash
# Create new project from template
cp -r templates/project-types/python-service my-service
cd my-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL (using Docker)
docker-compose up -d postgres

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

### Development

```bash
# Start dev server with hot reload (http://localhost:8000)
uvicorn app.main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html

# Lint code
pylint app tests

# Format code
black app tests
isort app tests

# Type check
mypy app

# Run all quality checks
black --check app tests && \
isort --check app tests && \
pylint app tests && \
mypy app

# Database migrations
alembic revision --autogenerate -m "description"  # Create migration
alembic upgrade head                               # Apply migrations
alembic downgrade -1                              # Rollback one migration
```

## Configuration Files

### requirements.txt

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
email-validator==2.1.0
pydantic[email]==2.5.2
pydantic-settings==2.1.0
python-dotenv==1.0.0
```

### requirements-dev.txt

```txt
pytest==7.4.3
pytest-cov==4.1.0
pytest-asyncio==0.21.1
httpx==0.25.2
black==23.12.0
pylint==3.0.3
isort==5.13.2
mypy==1.7.1
```

### pyproject.toml

```toml
[tool.black]
line-length = 100
target-version = ['py311']
include = '\.pyi?$'

[tool.isort]
profile = "black"
line_length = 100
multi_line_output = 3

[tool.pylint.main]
max-line-length = 100
disable = [
    "C0114",  # missing-module-docstring
    "C0115",  # missing-class-docstring
    "C0116",  # missing-function-docstring
]

[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "-v --strict-markers --cov=app --cov-report=term-missing"

[tool.coverage.run]
source = ["app"]
omit = ["*/tests/*", "*/alembic/*"]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise AssertionError",
    "raise NotImplementedError",
    "if __name__ == .__main__.:",
]
```

### Dockerfile

```dockerfile
# Build stage
FROM python:3.11-slim AS build

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq5 && \
    rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from build stage
COPY --from=build /root/.local /root/.local

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

# Copy application
COPY ./app ./app
COPY ./alembic ./alembic
COPY ./alembic.ini .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Run migrations and start app
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
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
      POSTGRES_DB: servicedb
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
      - '8000:8000'
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/servicedb
      - SECRET_KEY=your-secret-key-change-in-production
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  dev:
    image: python:3.11-slim
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - '8000:8000'
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/servicedb
      - SECRET_KEY=dev-secret-key
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
    command: >
      sh -c "apt-get update && 
             apt-get install -y --no-install-recommends gcc libpq-dev &&
             pip install -r requirements.txt -r requirements-dev.txt &&
             uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

### .env.example

```env
# Application
PROJECT_NAME=Python FastAPI Service
VERSION=1.0.0
DEBUG=True

# Server
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/servicedb

# Security
SECRET_KEY=your-secret-key-change-in-production-please-use-strong-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
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

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run migrations
        run: alembic upgrade head
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

      - name: Lint with pylint
        run: pylint app tests

      - name: Format check with black
        run: black --check app tests

      - name: Import sort check
        run: isort --check app tests

      - name: Type check with mypy
        run: mypy app

      - name: Run tests
        run: pytest --cov=app --cov-report=xml
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          SECRET_KEY: test-secret-key

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t python-service .
```

## API Endpoints

### Authentication

```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login and get access token
POST   /api/v1/auth/test-token   - Test if token is valid
```

### Users

```
GET    /api/v1/users/me          - Get current user profile
PUT    /api/v1/users/me          - Update current user profile
GET    /api/v1/users/{user_id}   - Get user by ID (admin only)
GET    /api/v1/users             - List all users (admin only)
DELETE /api/v1/users/{user_id}   - Delete user (admin only)
```

### Documentation

```
GET    /docs                     - Interactive API docs (Swagger UI)
GET    /redoc                    - Alternative API docs (ReDoc)
GET    /openapi.json             - OpenAPI schema
GET    /health                   - Health check endpoint
```

## Example Code

### app/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### app/api/v1/endpoints/auth.py

```python
from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.core.config import settings
from app.schemas.token import Token
from app.schemas.user import UserCreate, User
from app.services.auth_service import authenticate_user, create_user

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """Login and get access token"""
    user = authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """Register new user"""
    user = create_user(db, user_in)
    return user
```

### tests/api/test_auth.py

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "TestPassword123!",
            "first_name": "Test",
            "last_name": "User"
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_register_duplicate_email():
    # First registration
    client.post(
        "/api/v1/auth/register",
        json={"email": "duplicate@example.com", "password": "Password123!"},
    )
    
    # Second registration with same email
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "duplicate@example.com", "password": "Password123!"},
    )
    assert response.status_code == 400

def test_login_success():
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={"email": "login@example.com", "password": "Password123!"},
    )
    
    # Login
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "login@example.com", "password": "Password123!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password():
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={"email": "wrongpass@example.com", "password": "Password123!"},
    )
    
    # Login with wrong password
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "wrongpass@example.com", "password": "WrongPassword"},
    )
    assert response.status_code == 401
```

## Security Features

- ✅ **Password Hashing** - bcrypt with passlib
- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **CORS** - Configurable cross-origin requests
- ✅ **Input Validation** - Pydantic models
- ✅ **SQL Injection** - Prevented by SQLAlchemy ORM
- ✅ **Dependencies** - Security scanning with pip-audit

## Best Practices

### Code Organization

- Follow layered architecture (API → Services → Models)
- Keep routers thin, business logic in services
- Use dependency injection for database sessions
- Separate schemas for input/output validation

### Testing

- Write tests for all endpoints
- Test error cases and edge cases
- Use fixtures for common test data
- Maintain 70%+ code coverage

### Database

- Use Alembic for migrations
- Index frequently queried fields
- Use async database drivers for better performance
- Clean up expired tokens periodically

### Error Handling

- Use FastAPI's exception handlers
- Return consistent error responses
- Log errors properly
- Don't expose sensitive information

## Deployment

### Docker

```bash
# Build and run
docker-compose up -d app

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

### Heroku

```bash
heroku create my-service
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run alembic upgrade head
```

### AWS/Cloud

- Use environment variables for configuration
- Set up health checks
- Configure auto-scaling
- Use managed PostgreSQL

## License

MIT
