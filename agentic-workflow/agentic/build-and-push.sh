#!/bin/bash

# Agentic Workflow - Docker Build and Push Script
# Usage: ./build-and-push.sh [version]
# Example: ./build-and-push.sh v1.0.0

set -e

VERSION=${1:-latest}
IMAGE_NAME="sidkid78/agentic-workflow"
PLATFORMS="linux/amd64,linux/arm64"

echo "🚀 Agentic Workflow - Docker Build & Push"
echo "=========================================="
echo "Image: $IMAGE_NAME"
echo "Version: $VERSION"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    echo "⚠️  Not logged in to Docker Hub. Logging in..."
    docker login
fi

echo "🔨 Building Docker image..."
docker build -t $IMAGE_NAME:$VERSION .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Tag as latest if version is not latest
    if [ "$VERSION" != "latest" ]; then
        echo "🏷️  Tagging as latest..."
        docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:latest
    fi
    
    echo "📤 Pushing to Docker Hub..."
    echo ""
    
    # Push version tag
    echo "Pushing $IMAGE_NAME:$VERSION..."
    docker push $IMAGE_NAME:$VERSION
    
    # Push latest tag if version is not latest
    if [ "$VERSION" != "latest" ]; then
        echo "Pushing $IMAGE_NAME:latest..."
        docker push $IMAGE_NAME:latest
    fi
    
    echo ""
    echo "🎉 Successfully pushed $IMAGE_NAME:$VERSION to Docker Hub!"
    echo ""
    echo "📋 Image Details:"
    echo "   - Name: $IMAGE_NAME"
    echo "   - Version: $VERSION"
    echo "   - Size: $(docker images $IMAGE_NAME:$VERSION --format "{{.Size}}")"
    echo ""
    echo "🔗 Docker Hub: https://hub.docker.com/r/$IMAGE_NAME"
    echo ""
    echo "🚀 To run the image:"
    echo "   docker run -d -p 3000:3000 --name agentic-workflow $IMAGE_NAME:$VERSION"
    echo ""
    echo "📦 To use docker-compose:"
    echo "   docker-compose up -d"
    echo ""
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

