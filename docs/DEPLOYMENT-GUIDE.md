# Deployment Guide

Complete guide for deploying GitHub Copilot Orchestra projects across various platforms.

## Overview

This guide covers deployment strategies for projects created with Copilot Orchestra, including:
- Docker containerization
- Kubernetes orchestration  
- Cloud platform deployment (AWS, Azure, GCP)
- CI/CD pipeline setup
- Environment management

## Docker Deployment

### Basic Docker Setup

All project templates include Docker support. Basic structure:

```
project/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── .env.example
```

### Building and Running

```bash
# Build image
docker build -t my-app:1.0.0 .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production my-app:1.0.0

# Using Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Multi-Stage Builds

Example Dockerfile with multi-stage build:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Docker Compose for Development

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/mydb
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Kubernetes Deployment

### Basic Kubernetes Resources

Templates are provided in `deployment/kubernetes/`:

```
kubernetes/
├── deployment.yml
├── service.yml
├── ingress.yml
├── configmap.yml
└── secrets.yml
```

### Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service and Ingress

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80
```

### Deploying to Kubernetes

```bash
# Create namespace
kubectl create namespace myapp

# Apply configurations
kubectl apply -f kubernetes/ -n myapp

# Check deployment status
kubectl get pods -n myapp
kubectl get services -n myapp

# View logs
kubectl logs -f deployment/my-app -n myapp

# Scale deployment
kubectl scale deployment my-app --replicas=5 -n myapp
```

## Cloud Platform Deployment

### AWS Deployment

**EC2 with Docker:**
```bash
# Install Docker on EC2
sudo yum update -y
sudo yum install docker -y
sudo service docker start

# Pull and run image
docker pull my-app:latest
docker run -d -p 80:3000 my-app:latest
```

**ECS (Elastic Container Service):**
```json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "my-app",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:db-url"
        }
      ]
    }
  ]
}
```

**Lambda (Serverless):**
```javascript
// handler.js
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda' })
  };
};
```

### Azure Deployment

**App Service:**
```bash
# Create resource group
az group create --name myapp-rg --location eastus

# Create App Service plan
az appservice plan create --name myapp-plan --resource-group myapp-rg --is-linux

# Create web app
az webapp create --resource-group myapp-rg --plan myapp-plan --name myapp --runtime "NODE|18-lts"

# Deploy from Docker
az webapp config container set --name myapp --resource-group myapp-rg \
  --docker-custom-image-name my-app:latest \
  --docker-registry-server-url https://myregistry.azurecr.io
```

### Google Cloud Platform

**Cloud Run:**
```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/my-app

# Deploy to Cloud Run
gcloud run deploy my-app \
  --image gcr.io/PROJECT_ID/my-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**GKE (Google Kubernetes Engine):**
```bash
# Create cluster
gcloud container clusters create my-cluster --num-nodes=3

# Get credentials
gcloud container clusters get-credentials my-cluster

# Deploy
kubectl apply -f kubernetes/
```

## CI/CD Pipeline Setup

### GitHub Actions

All templates include `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t my-app:${{ github.sha }} .
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push my-app:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Add deployment commands here
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
    - npm run lint

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/my-app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
```

## Environment Management

### Environment Variables

**Development (.env.development):**
```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/mydb
API_URL=http://localhost:3000
LOG_LEVEL=debug
```

**Production (.env.production):**
```env
NODE_ENV=production
DATABASE_URL=${DATABASE_URL}
API_URL=https://api.myapp.com
LOG_LEVEL=info
```

### Secrets Management

**AWS Secrets Manager:**
```bash
# Store secret
aws secretsmanager create-secret --name myapp/database-url --secret-string "postgresql://..."

# Retrieve in application
const secret = await secretsManager.getSecretValue({ SecretId: 'myapp/database-url' }).promise();
```

**Kubernetes Secrets:**
```bash
# Create secret
kubectl create secret generic app-secrets \
  --from-literal=database-url=postgresql://... \
  --from-literal=jwt-secret=...

# Use in deployment
env:
- name: DATABASE_URL
  valueFrom:
    secretKeyRef:
      name: app-secrets
      key: database-url
```

## Monitoring and Logging

### Health Checks

Add health check endpoint:

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis()
    }
  });
});
```

### Logging

Use structured logging:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Application Performance Monitoring

Consider integrating:
- **Datadog** - Full-stack monitoring
- **New Relic** - APM and infrastructure
- **Sentry** - Error tracking
- **Prometheus + Grafana** - Metrics and dashboards

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] Linting passes with zero errors
- [ ] Security scan shows no critical vulnerabilities
- [ ] Database migrations tested and reversible
- [ ] Environment variables configured in production
- [ ] Secrets stored securely (not in code)
- [ ] Health check endpoint working
- [ ] Logging configured appropriately
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] Load testing completed (if applicable)
- [ ] SSL/TLS certificates configured
- [ ] CORS settings correct for production
- [ ] Rate limiting configured
- [ ] Documentation updated

## Troubleshooting

**Container won't start:**
```bash
# Check logs
docker logs <container-id>

# Check if port is already in use
lsof -i :3000

# Verify environment variables
docker inspect <container-id> | grep -A 20 Env
```

**Kubernetes pod crashes:**
```bash
# Describe pod for events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Check previous container logs
kubectl logs <pod-name> --previous
```

**Database connection fails:**
```bash
# Test connection from container
docker exec -it <container-id> sh
nc -zv database-host 5432

# Check environment variables
env | grep DATABASE
```

## Best Practices

1. **Use Multi-Stage Builds** - Smaller images, faster deploys
2. **Don't Run as Root** - Security best practice
3. **Health Checks** - Enable auto-healing
4. **Resource Limits** - Prevent resource exhaustion
5. **Immutable Infrastructure** - Never modify running containers
6. **Blue-Green Deployment** - Zero-downtime updates
7. **Rollback Strategy** - Always have a way back
8. **Monitor Everything** - Logs, metrics, traces
9. **Automate** - CI/CD for consistency
10. **Document** - Deployment procedures and runbooks

## Summary

GitHub Copilot Orchestra projects come deployment-ready:
- ✅ Docker and Docker Compose configurations
- ✅ Kubernetes manifests
- ✅ CI/CD pipeline templates
- ✅ Cloud platform examples
- ✅ Environment management
- ✅ Health checks and monitoring

Follow this guide to deploy confidently to any platform.
