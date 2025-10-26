# 🐳 Docker Deployment Guide

This guide will help you build, run, and deploy the Agentic Workflow platform using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- Docker Hub account (for publishing)

## 🚀 Quick Start

### 1. Build the Docker Image

```bash
# Navigate to the project directory
cd agentic

# Build the image
docker build -t sidkid78/agentic-workflow:latest .
```

### 2. Run with Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root (copy from `env.example`):

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
GITHUB_TOKEN=your_github_token_here
DEFAULT_MODEL=gemini-2.5-flash
MAX_CONCURRENT_AGENTS=5
```

## 🏗️ Building for Production

### Multi-Architecture Build

Build for multiple platforms (AMD64 and ARM64):

```bash
# Create a new builder instance
docker buildx create --name mybuilder --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t sidkid78/agentic-workflow:latest \
  --push .
```

### Build with Version Tag

```bash
# Build with specific version
docker build -t sidkid78/agentic-workflow:v1.0.0 .
docker build -t sidkid78/agentic-workflow:latest .
```

## 📤 Publishing to Docker Hub

### 1. Login to Docker Hub

```bash
docker login
```

### 2. Tag the Image

```bash
docker tag sidkid78/agentic-workflow:latest sidkid78/agentic-workflow:v1.0.0
```

### 3. Push to Docker Hub

```bash
# Push specific version
docker push sidkid78/agentic-workflow:v1.0.0

# Push latest
docker push sidkid78/agentic-workflow:latest
```

### 4. Automated Build and Push Script

Create a `build-and-push.sh` script:

```bash
#!/bin/bash

VERSION=${1:-latest}
IMAGE_NAME="sidkid78/agentic-workflow"

echo "Building $IMAGE_NAME:$VERSION..."
docker build -t $IMAGE_NAME:$VERSION .

if [ $? -eq 0 ]; then
    echo "Build successful! Pushing to Docker Hub..."
    docker push $IMAGE_NAME:$VERSION
    
    if [ "$VERSION" != "latest" ]; then
        docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:latest
        docker push $IMAGE_NAME:latest
    fi
    
    echo "✅ Successfully pushed $IMAGE_NAME:$VERSION"
else
    echo "❌ Build failed"
    exit 1
fi
```

Make it executable and run:

```bash
chmod +x build-and-push.sh
./build-and-push.sh v1.0.0
```

## 🎯 Deployment Options

### Option 1: Docker Run (Simple)

```bash
docker run -d \
  --name agentic-workflow \
  -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  --restart unless-stopped \
  sidkid78/agentic-workflow:latest
```

### Option 2: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Scale if needed (future)
docker-compose up -d --scale agentic-web=3
```

### Option 3: Docker Swarm (Production)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml agentic

# Check status
docker stack services agentic

# Remove stack
docker stack rm agentic
```

### Option 4: Kubernetes

Create a `k8s-deployment.yml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agentic-workflow
spec:
  replicas: 3
  selector:
    matchLabels:
      app: agentic-workflow
  template:
    metadata:
      labels:
        app: agentic-workflow
    spec:
      containers:
      - name: agentic-workflow
        image: sidkid78/agentic-workflow:latest
        ports:
        - containerPort: 3000
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: agentic-secrets
              key: gemini-api-key
---
apiVersion: v1
kind: Service
metadata:
  name: agentic-workflow-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: agentic-workflow
```

Deploy:

```bash
kubectl apply -f k8s-deployment.yml
```

## 🔍 Monitoring & Health Checks

### Health Check Endpoint

The application includes a health check at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

### View Container Logs

```bash
# Docker logs
docker logs agentic-workflow -f

# Docker Compose logs
docker-compose logs -f agentic-web
```

### Container Stats

```bash
docker stats agentic-workflow
```

## 🛠️ Troubleshooting

### Container won't start

```bash
# Check logs
docker logs agentic-workflow

# Inspect container
docker inspect agentic-workflow

# Check if port is already in use
netstat -tulpn | grep 3000
```

### Permission Issues

```bash
# The container runs as non-root user (nextjs:nodejs)
# If you need to debug, run as root temporarily:
docker exec -it --user root agentic-workflow sh
```

### Rebuild without Cache

```bash
docker build --no-cache -t sidkid78/agentic-workflow:latest .
```

### Clear Docker Resources

```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove all unused resources
docker system prune -a
```

## 📊 Performance Optimization

### Image Size

The multi-stage build reduces the final image size:
- Stage 1 (deps): ~500MB
- Stage 2 (builder): ~1.2GB
- Stage 3 (runner): ~200MB ✅

### Memory Limits

Limit container memory:

```bash
docker run -d \
  --name agentic-workflow \
  -p 3000:3000 \
  --memory="1g" \
  --memory-swap="1g" \
  sidkid78/agentic-workflow:latest
```

Or in docker-compose.yml:

```yaml
services:
  agentic-web:
    # ... other config
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1'
        reservations:
          memory: 512M
          cpus: '0.5'
```

## 🔐 Security Best Practices

1. **Never commit sensitive data**
   - Use `.env` files (already gitignored)
   - Use Docker secrets for production

2. **Run as non-root user**
   - Already configured in Dockerfile (user: nextjs)

3. **Keep base images updated**
   ```bash
   docker pull node:20-alpine
   docker build --pull -t sidkid78/agentic-workflow:latest .
   ```

4. **Scan for vulnerabilities**
   ```bash
   docker scan sidkid78/agentic-workflow:latest
   ```

## 🌐 Production Deployment

### AWS ECS

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag sidkid78/agentic-workflow:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/agentic-workflow:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/agentic-workflow:latest
```

### Google Cloud Run

```bash
# Deploy to Cloud Run
gcloud run deploy agentic-workflow \
  --image sidkid78/agentic-workflow:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform

Simply connect your Docker Hub repository and deploy!

## 📝 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: ./agentic
        push: true
        tags: |
          sidkid78/agentic-workflow:latest
          sidkid78/agentic-workflow:${{ github.sha }}
```

## 🎉 Next Steps

1. **Test locally**: `docker-compose up -d`
2. **Configure environment**: Edit `.env` file
3. **Build and push**: `./build-and-push.sh v1.0.0`
4. **Deploy to production**: Choose your platform
5. **Monitor and scale**: Set up monitoring tools

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Hub](https://hub.docker.com/)
- [Best Practices for Node.js in Docker](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**Need Help?** Open an issue on GitHub or check the main README.md

