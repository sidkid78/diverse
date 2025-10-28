#!/bin/bash

# Docker Scout Environment Setup Script
# This script creates development, staging, and production environments
# for the Agentic Workflow platform

set -e

# Configuration
DOCKER_ORG="${DOCKER_ORG:-sidkid1978}"
IMAGE_NAME="agentic-workflow"
LATEST_TAG="latest"
VERSION_TAG="${VERSION_TAG:-v1.0.0}"
PLATFORM="${PLATFORM:-linux/amd64}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Docker Scout Environment Setup${NC}"
echo "========================================"
echo "Organization: $DOCKER_ORG"
echo "Image: $IMAGE_NAME"
echo "Platform: $PLATFORM"
echo "Latest Tag: $LATEST_TAG"
echo "Version Tag: $VERSION_TAG"
echo ""

# Check if Docker is running
echo -n "Checking Docker... "
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌${NC}"
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi
echo -e "${GREEN}✓${NC}"

# Check if logged in to Docker Hub
echo -n "Checking Docker Hub authentication... "
if ! docker info | grep -q "Username:"; then
    echo -e "${YELLOW}⚠${NC}"
    echo "Not logged in to Docker Hub. Please run: docker login"
    exit 1
fi
echo -e "${GREEN}✓${NC}"

# Check if images exist
echo ""
echo "Verifying images..."
echo -n "  - Checking ${DOCKER_ORG}/${IMAGE_NAME}:${LATEST_TAG}... "
if docker pull ${DOCKER_ORG}/${IMAGE_NAME}:${LATEST_TAG} > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} (not found, will skip development environment)"
    SKIP_DEV=true
fi

echo -n "  - Checking ${DOCKER_ORG}/${IMAGE_NAME}:${VERSION_TAG}... "
if docker pull ${DOCKER_ORG}/${IMAGE_NAME}:${VERSION_TAG} > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} (not found, will skip staging/production environments)"
    SKIP_VERSIONED=true
fi

echo ""
echo "Creating environments..."

# Create Development Environment
if [ "$SKIP_DEV" != true ]; then
    echo -n "📦 Development environment... "
    if docker scout environment --platform $PLATFORM development \
        ${DOCKER_ORG}/${IMAGE_NAME}:${LATEST_TAG} > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo "   Failed to create development environment"
    fi
fi

# Create Staging Environment
if [ "$SKIP_VERSIONED" != true ]; then
    echo -n "📦 Staging environment... "
    if docker scout environment --platform $PLATFORM staging \
        ${DOCKER_ORG}/${IMAGE_NAME}:${VERSION_TAG} > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo "   Failed to create staging environment"
    fi

    # Create Production Environment
    echo -n "📦 Production environment... "
    if docker scout environment --platform $PLATFORM production \
        ${DOCKER_ORG}/${IMAGE_NAME}:${VERSION_TAG} > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo "   Failed to create production environment"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. View environments: https://scout.docker.com/org/${DOCKER_ORG}"
echo "  2. Analyze image: docker scout cves ${DOCKER_ORG}/${IMAGE_NAME}:${VERSION_TAG}"
echo "  3. Compare: docker scout compare --to-env production ${DOCKER_ORG}/${IMAGE_NAME}:${LATEST_TAG}"
echo ""
echo "For multi-architecture support, run:"
echo "  PLATFORM=linux/arm64 ./setup-scout-environments.sh"

