# 🐳 Docker Quick Reference

## 📦 Build Commands

```bash
# Basic build
docker build -t sidkid78/agentic-workflow:latest .

# Build without cache
docker build --no-cache -t sidkid78/agentic-workflow:latest .

# Build with version tag
docker build -t sidkid78/agentic-workflow:v1.0.0 .

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 -t sidkid78/agentic-workflow:latest --push .
```

## 🚀 Run Commands

```bash
# Simple run
docker run -d -p 3000:3000 --name agentic-workflow sidkid78/agentic-workflow:latest

# Run with environment variables
docker run -d -p 3000:3000 \
  --name agentic-workflow \
  -e GEMINI_API_KEY=your_key \
  -e GITHUB_TOKEN=your_token \
  sidkid78/agentic-workflow:latest

# Run with memory limits
docker run -d -p 3000:3000 \
  --name agentic-workflow \
  --memory="1g" \
  --memory-swap="1g" \
  sidkid78/agentic-workflow:latest

# Run with restart policy
docker run -d -p 3000:3000 \
  --name agentic-workflow \
  --restart unless-stopped \
  sidkid78/agentic-workflow:latest
```

## 🔍 Inspect & Debug

```bash
# View logs
docker logs agentic-workflow
docker logs -f agentic-workflow  # Follow logs
docker logs --tail 100 agentic-workflow  # Last 100 lines

# Container stats
docker stats agentic-workflow

# Inspect container
docker inspect agentic-workflow

# Execute commands inside container
docker exec -it agentic-workflow sh
docker exec -it --user root agentic-workflow sh  # As root

# Check health
docker inspect --format='{{.State.Health.Status}}' agentic-workflow
```

## 🛑 Stop & Remove

```bash
# Stop container
docker stop agentic-workflow

# Start container
docker start agentic-workflow

# Restart container
docker restart agentic-workflow

# Remove container
docker rm agentic-workflow

# Force remove running container
docker rm -f agentic-workflow

# Stop and remove
docker stop agentic-workflow && docker rm agentic-workflow
```

## 📤 Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag sidkid78/agentic-workflow:latest sidkid78/agentic-workflow:v1.0.0

# Push image
docker push sidkid78/agentic-workflow:v1.0.0
docker push sidkid78/agentic-workflow:latest

# Push all tags
docker push sidkid78/agentic-workflow --all-tags
```

## 🧹 Cleanup

```bash
# Remove unused images
docker image prune

# Remove all stopped containers
docker container prune

# Remove all unused containers, networks, images
docker system prune

# Remove everything (use with caution!)
docker system prune -a --volumes

# Remove specific image
docker rmi sidkid78/agentic-workflow:latest

# Remove all images for this app
docker rmi $(docker images sidkid78/agentic-workflow -q)
```

## 📦 Docker Compose Commands

```bash
# Start services
docker-compose up
docker-compose up -d  # Detached mode

# Stop services
docker-compose down

# View logs
docker-compose logs
docker-compose logs -f  # Follow logs
docker-compose logs agentic-web  # Specific service

# Rebuild and restart
docker-compose up -d --build

# Scale services
docker-compose up -d --scale agentic-web=3

# Pull latest images
docker-compose pull

# Show running services
docker-compose ps

# Execute commands
docker-compose exec agentic-web sh
```

## 🔬 Testing & Validation

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test from inside container
docker exec agentic-workflow curl http://localhost:3000/api/health

# Check exposed ports
docker port agentic-workflow

# Check environment variables
docker exec agentic-workflow env

# Validate Docker Compose file
docker-compose config
```

## 📊 Image Management

```bash
# List all images
docker images

# List all containers
docker ps -a

# Search for images
docker search agentic-workflow

# Pull image from Docker Hub
docker pull sidkid78/agentic-workflow:latest

# Show image history
docker history sidkid78/agentic-workflow:latest

# Show image size
docker images sidkid78/agentic-workflow --format "{{.Size}}"
```

## 🔐 Security Scanning

```bash
# Scan for vulnerabilities
docker scan sidkid78/agentic-workflow:latest

# Scan with Trivy
trivy image sidkid78/agentic-workflow:latest
```

## 🌐 Network Commands

```bash
# List networks
docker network ls

# Inspect network
docker network inspect agentic_agentic-network

# Connect container to network
docker network connect agentic_agentic-network agentic-workflow

# Disconnect from network
docker network disconnect agentic_agentic-network agentic-workflow
```

## 💾 Volume Commands

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect agentic_agentic-data

# Remove volume
docker volume rm agentic_agentic-data

# Remove all unused volumes
docker volume prune
```

## 🚨 Troubleshooting

```bash
# Check if port is in use
netstat -tulpn | grep 3000
lsof -i :3000  # macOS/Linux

# Check Docker daemon
docker info

# Restart Docker daemon
sudo systemctl restart docker  # Linux
# Or restart Docker Desktop on macOS/Windows

# Check disk space
docker system df

# Clean up build cache
docker builder prune
```

## 📝 Quick Script

Save this as `docker-quick.sh`:

```bash
#!/bin/bash

case $1 in
  start)
    docker-compose up -d
    ;;
  stop)
    docker-compose down
    ;;
  restart)
    docker-compose restart
    ;;
  logs)
    docker-compose logs -f
    ;;
  build)
    ./build-and-push.sh ${2:-latest}
    ;;
  clean)
    docker-compose down -v
    docker system prune -af
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|build|clean}"
    exit 1
    ;;
esac
```

Make it executable:

```bash
chmod +x docker-quick.sh
```

Use it:

```bash
./docker-quick.sh start
./docker-quick.sh logs
./docker-quick.sh build v1.0.0
```

