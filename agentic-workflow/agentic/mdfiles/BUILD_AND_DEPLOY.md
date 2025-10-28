# 🚀 Build and Deploy Guide

Complete workflow for building, pushing, and deploying the Agentic Workflow platform.

## Prerequisites

- Docker Desktop running
- Logged in to Docker Hub (`docker login`)
- Your API keys ready (Gemini, GitHub)

## Step-by-Step Process

### Step 1: Build the Image

#### Windows (PowerShell)
```powershell
# Navigate to project
cd agentic

# Build and push (creates v1.0.0 and latest tags)
.\build-and-push.ps1 v1.0.0
```

#### Linux/Mac (Bash)
```bash
# Navigate to project
cd agentic

# Build and push
./build-and-push.sh v1.0.0
```

#### Manual Build
```bash
# Build the image
docker build -t sidkid1978/agentic-workflow:v1.0.0 .

# Tag as latest
docker tag sidkid1978/agentic-workflow:v1.0.0 sidkid1978/agentic-workflow:latest

# Push both tags
docker push sidkid1978/agentic-workflow:v1.0.0
docker push sidkid1978/agentic-workflow:latest
```

### Step 2: Set Up Docker Scout (Optional but Recommended)

#### Windows
```powershell
.\setup-scout-environments.ps1
```

#### Linux/Mac
```bash
./setup-scout-environments.sh
```

This creates three environments:
- **Development** (`latest` tag)
- **Staging** (`v1.0.0` tag)
- **Production** (`v1.0.0` tag)

### Step 3: Scan for Vulnerabilities

```bash
# Check for security issues
docker scout cves sidkid1978/agentic-workflow:v1.0.0

# Only show critical and high severity
docker scout cves --only-severity critical,high sidkid1978/agentic-workflow:v1.0.0

# Get recommendations
docker scout recommendations sidkid1978/agentic-workflow:v1.0.0
```

### Step 4: Deploy

#### Option A: Docker Compose (Recommended)

```bash
# Create .env file with your API keys
cp env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the services
docker-compose up -d

# Check logs
docker-compose logs -f

# Verify it's running
curl http://localhost:3000/api/health
```

#### Option B: Docker Run

```bash
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  -e GITHUB_TOKEN=your_token_here \
  --name agentic-workflow \
  sidkid1978/agentic-workflow:v1.0.0
```

## Complete Workflow Example

Here's the full process from code changes to production:

```powershell
# 1. Navigate to project
cd C:\Users\sidki\source\repos\orchprog\agentic-workflow\agentic

# 2. Make sure Docker is running
docker info

# 3. Login to Docker Hub (if not already logged in)
docker login

# 4. Build and push the new version
.\build-and-push.ps1 v1.0.0

# 5. Set up Scout environments (first time only)
.\setup-scout-environments.ps1

# 6. Scan for vulnerabilities
docker scout cves sidkid1978/agentic-workflow:v1.0.0

# 7. Compare with production (if updating)
docker scout compare --to-env production sidkid1978/agentic-workflow:v1.0.0

# 8. If all looks good, update production environment
docker scout environment --platform linux/amd64 production sidkid1978/agentic-workflow:v1.0.0

# 9. Deploy
docker-compose down
docker-compose pull
docker-compose up -d

# 10. Verify
Start-Process "http://localhost:3000/api/health"
```

## Versioning Strategy

### Semantic Versioning

Follow semantic versioning: `vMAJOR.MINOR.PATCH`

```bash
# Major release (breaking changes)
.\build-and-push.ps1 v2.0.0

# Minor release (new features, backward compatible)
.\build-and-push.ps1 v1.1.0

# Patch release (bug fixes)
.\build-and-push.ps1 v1.0.1
```

### Tag Strategy

| Tag | Use Case | When to Update |
|-----|----------|----------------|
| `latest` | Development, testing | Every build |
| `v1.0.0` | Specific release | New releases only |
| `v1.0` | Minor version series | Minor releases |
| `v1` | Major version series | Major releases |

### Example Tags

```bash
# Build with multiple tags
docker build -t sidkid1978/agentic-workflow:v1.0.0 .
docker tag sidkid1978/agentic-workflow:v1.0.0 sidkid1978/agentic-workflow:v1.0
docker tag sidkid1978/agentic-workflow:v1.0.0 sidkid1978/agentic-workflow:v1
docker tag sidkid1978/agentic-workflow:v1.0.0 sidkid1978/agentic-workflow:latest

# Push all tags
docker push sidkid1978/agentic-workflow:v1.0.0
docker push sidkid1978/agentic-workflow:v1.0
docker push sidkid1978/agentic-workflow:v1
docker push sidkid1978/agentic-workflow:latest
```

## Multi-Architecture Builds

For deployment across different platforms (AMD64 and ARM64):

```bash
# Create builder
docker buildx create --name multiarch --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t sidkid1978/agentic-workflow:v1.0.0 \
  -t sidkid1978/agentic-workflow:latest \
  --push .

# Set up Scout for both architectures
docker scout environment --platform linux/amd64 production sidkid1978/agentic-workflow:v1.0.0
docker scout environment --platform linux/arm64 production sidkid1978/agentic-workflow:v1.0.0
```

## Environment Variables

Always set these before deploying:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional but recommended
GITHUB_TOKEN=your_github_token_here
DEFAULT_MODEL=gemini-2.5-flash
MAX_CONCURRENT_AGENTS=5
DEFAULT_REPO=https://github.com/sidkid78/diverse.git
```

## Rollback Process

If something goes wrong:

```bash
# Stop current version
docker-compose down

# Pull previous version
docker pull sidkid1978/agentic-workflow:v0.9.0

# Update docker-compose.yml to use v0.9.0
# Or set environment variable
export VERSION=v0.9.0

# Restart
docker-compose up -d

# Update Scout production environment
docker scout environment --platform linux/amd64 production sidkid1978/agentic-workflow:v0.9.0
```

## Monitoring After Deployment

```bash
# Check health
curl http://localhost:3000/api/health

# View logs
docker-compose logs -f

# Check container stats
docker stats

# Check for errors
docker-compose logs --tail=100 | findstr /i "error"

# Test functionality
curl -X POST http://localhost:3000/api/plans/generate \
  -H "Content-Type: application/json" \
  -d "{\"mission_statement\":\"Test\",\"repo_url\":\"https://github.com/sidkid78/diverse\"}"
```

## CI/CD Integration

### GitHub Actions

Add to `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./agentic
          push: true
          tags: |
            sidkid1978/agentic-workflow:${{ github.ref_name }}
            sidkid1978/agentic-workflow:latest
      
      - name: Docker Scout
        uses: docker/scout-action@v1
        with:
          command: cves
          image: sidkid1978/agentic-workflow:${{ github.ref_name }}
          only-severities: critical,high
          exit-code: true
      
      - name: Update Scout Environment
        run: |
          docker scout environment --platform linux/amd64 production \
            sidkid1978/agentic-workflow:${{ github.ref_name }}
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
docker builder prune -a
docker build --no-cache -t sidkid1978/agentic-workflow:v1.0.0 .
```

### Push Fails - Authentication

```bash
# Re-login
docker logout
docker login
```

### Push Fails - Rate Limit

```bash
# Wait and retry, or upgrade Docker Hub plan
# Check rate limit status
docker pull ratelimitpreview/test
```

### Container Won't Start

```bash
# Check logs
docker logs agentic-workflow

# Check environment variables
docker inspect agentic-workflow | grep -A 20 "Env"

# Verify image
docker inspect sidkid1978/agentic-workflow:v1.0.0
```

## Quick Reference

### Build Only
```bash
docker build -t sidkid1978/agentic-workflow:v1.0.0 .
```

### Build and Push
```powershell
.\build-and-push.ps1 v1.0.0
```

### Scout Setup
```powershell
.\setup-scout-environments.ps1
```

### Deploy
```bash
docker-compose up -d
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

### View Logs
```bash
docker-compose logs -f
```

### Stop
```bash
docker-compose down
```

## Summary

The typical workflow is:
1. ✅ Build with `.\build-and-push.ps1 v1.0.0`
2. ✅ Setup Scout with `.\setup-scout-environments.ps1` (first time)
3. ✅ Scan with `docker scout cves`
4. ✅ Deploy with `docker-compose up -d`
5. ✅ Verify with health check

That's it! 🚀

