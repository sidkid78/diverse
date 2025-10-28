# 🔍 Docker Scout Environment Setup

Docker Scout helps you monitor and secure your container images across different environments.

## Prerequisites

- Docker Desktop or Docker CLI with Scout enabled
- Docker Hub account
- Images pushed to a registry

## Quick Setup

### 1. Enable Docker Scout

```bash
# Login to Docker Hub
docker login

# Enable Scout (if not already enabled)
docker scout enroll <your-org-name>
```

### 2. Set Your Organization

```bash
# Set your Docker organization
export DOCKER_ORG="sidkid1978"  # Replace with your org name
```

### 3. Create Environments

We recommend creating three environments for the application lifecycle:

#### Development Environment

```bash
docker scout environment --platform linux/amd64 development ${DOCKER_ORG}/agentic-workflow:latest
```

#### Staging Environment

```bash
docker scout environment --platform linux/amd64 staging ${DOCKER_ORG}/agentic-workflow:v1.0.0
```

#### Production Environment

```bash
docker scout environment --platform linux/amd64 production ${DOCKER_ORG}/agentic-workflow:v1.0.0
```

### 4. Multi-Architecture Support

If you've built multi-arch images (AMD64 and ARM64):

```bash
# AMD64 (x86_64) - most common for servers
docker scout environment --platform linux/amd64 production ${DOCKER_ORG}/agentic-workflow:v1.0.0

# ARM64 (for Apple Silicon, AWS Graviton, etc.)
docker scout environment --platform linux/arm64 production ${DOCKER_ORG}/agentic-workflow:v1.0.0
```

## Complete Setup Script

Create a file `setup-scout-environments.sh`:

```bash
#!/bin/bash

# Docker Scout Environment Setup Script
# This script creates development, staging, and production environments

set -e

# Configuration
DOCKER_ORG="${DOCKER_ORG:-sidkid1978}"
IMAGE_NAME="agentic-workflow"
LATEST_TAG="latest"
VERSION_TAG="${VERSION_TAG:-v1.0.0}"
PLATFORM="${PLATFORM:-linux/amd64}"

echo "🔍 Setting up Docker Scout Environments"
echo "========================================"
echo "Organization: $DOCKER_ORG"
echo "Image: $IMAGE_NAME"
echo "Platform: $PLATFORM"
echo ""

# Check if logged in
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create Development Environment
echo "📦 Creating development environment..."
docker scout environment --platform $PLATFORM development \
  ${DOCKER_ORG}/${IMAGE_NAME}:${LATEST_TAG}
echo "✅ Development environment created"

# Create Staging Environment
echo "📦 Creating staging environment..."
docker scout environment --platform $PLATFORM staging \
  ${DOCKER_ORG}/${IMAGE_NAME}:${VERSION_TAG}
echo "✅ Staging environment created"

# Create Production Environment
echo "📦 Creating production environment..."
docker scout environment --platform $PLATFORM production \
  ${DOCKER_ORG}/${IMAGE_NAME}:${VERSION_TAG}
echo "✅ Production environment created"

echo ""
echo "🎉 All environments created successfully!"
echo ""
echo "View your environments:"
echo "  https://scout.docker.com/org/${DOCKER_ORG}"
echo ""
echo "Analyze an image:"
echo "  docker scout cves ${DOCKER_ORG}/${IMAGE_NAME}:${VERSION_TAG}"
echo ""
echo "Compare environments:"
echo "  docker scout compare --to-env production ${DOCKER_ORG}/${IMAGE_NAME}:${LATEST_TAG}"
```

Make it executable and run:

```bash
chmod +x setup-scout-environments.sh
./setup-scout-environments.sh
```

## Using Docker Scout

### Analyze Image for Vulnerabilities

```bash
docker scout cves sidkid1978/agentic-workflow:v1.0.0
```

### Get Recommendations

```bash
docker scout recommendations sidkid1978/agentic-workflow:v1.0.0
```

### Compare Images

Compare a new build with production:

```bash
docker scout compare \
  --to-env production \
  sidkid1978/agentic-workflow:latest
```

### View Quick Summary

```bash
docker scout quickview sidkid1978/agentic-workflow:v1.0.0
```

## Environment Best Practices

### Development Environment
- **Purpose**: Active development, frequent updates
- **Image Tag**: `latest` or `dev`
- **Update Frequency**: Every commit
- **Security Threshold**: Low (accept minor vulnerabilities)

```bash
docker scout environment --platform linux/amd64 development \
  sidkid1978/agentic-workflow:latest
```

### Staging Environment
- **Purpose**: Pre-production testing
- **Image Tag**: Release candidates (e.g., `v1.0.0-rc1`)
- **Update Frequency**: Weekly or per release
- **Security Threshold**: Medium (fix high/critical)

```bash
docker scout environment --platform linux/amd64 staging \
  sidkid1978/agentic-workflow:v1.0.0-rc1
```

### Production Environment
- **Purpose**: Live deployment
- **Image Tag**: Stable versions (e.g., `v1.0.0`)
- **Update Frequency**: Monthly or per major release
- **Security Threshold**: High (zero tolerance for critical)

```bash
docker scout environment --platform linux/amd64 production \
  sidkid1978/agentic-workflow:v1.0.0
```

## Automated Scanning with GitHub Actions

Add to `.github/workflows/docker-scout.yml`:

```yaml
name: Docker Scout

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  scout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Docker Scout
        uses: docker/scout-action@v1
        with:
          command: cves
          image: sidkid1978/agentic-workflow:latest
          only-severities: critical,high
          exit-code: true
```

## Monitoring and Alerts

### Set Up Policy Evaluation

Create `.docker/scout-policy.yml`:

```yaml
version: v1
policies:
  - name: critical-vulnerabilities
    description: No critical vulnerabilities allowed
    conditions:
      - type: vulnerability
        severity: critical
        max_count: 0
    
  - name: high-vulnerabilities
    description: Maximum 5 high severity vulnerabilities
    conditions:
      - type: vulnerability
        severity: high
        max_count: 5
    
  - name: outdated-base-image
    description: Base image must be less than 30 days old
    conditions:
      - type: base_image_age
        max_age: 30d
```

### Evaluate Policy

```bash
docker scout policy sidkid1978/agentic-workflow:v1.0.0
```

## Updating Environments

When you release a new version:

```bash
# Build and push new version
docker build -t sidkid1978/agentic-workflow:v1.1.0 .
docker push sidkid1978/agentic-workflow:v1.1.0

# Update staging first
docker scout environment --platform linux/amd64 staging \
  sidkid1978/agentic-workflow:v1.1.0

# After testing, promote to production
docker scout environment --platform linux/amd64 production \
  sidkid1978/agentic-workflow:v1.1.0
```

## Cleaning Up

Remove an environment:

```bash
# Not directly supported, but you can reassign
# Or contact Docker support to remove unused environments
```

## Integration with CI/CD

### GitLab CI

```yaml
scout:scan:
  stage: security
  image: docker:latest
  script:
    - docker scout cves $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker scout compare --to-env production $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### Jenkins

```groovy
stage('Docker Scout') {
    steps {
        sh 'docker scout cves ${DOCKER_IMAGE}:${BUILD_NUMBER}'
        sh 'docker scout compare --to-env production ${DOCKER_IMAGE}:${BUILD_NUMBER}'
    }
}
```

## Troubleshooting

### "Organization not found"

```bash
# Verify your organization
docker info | grep Organization

# Set the correct organization
docker scout enroll <your-org-name>
```

### "Image not found"

```bash
# Ensure image is pushed to registry
docker push sidkid1978/agentic-workflow:latest

# Verify image exists
docker images | grep agentic-workflow
```

### "Platform not supported"

```bash
# List available platforms
docker buildx imagetools inspect sidkid1978/agentic-workflow:latest

# Use the correct platform from the list
docker scout environment --platform linux/amd64 production ...
```

## Resources

- **Docker Scout Docs**: https://docs.docker.com/scout/
- **Docker Scout Dashboard**: https://scout.docker.com/
- **Best Practices**: https://docs.docker.com/scout/guides/

## Summary

Docker Scout environments help you:
- 🔍 Monitor vulnerabilities across deployments
- 📊 Compare images between environments
- 🚨 Get alerts for security issues
- 📈 Track improvement over time
- ✅ Enforce security policies

Run the setup script to get started:
```bash
./setup-scout-environments.sh
```

