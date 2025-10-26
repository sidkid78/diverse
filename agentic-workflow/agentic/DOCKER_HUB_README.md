# 🤖 Agentic Workflow Platform

> A powerful, scalable agentic coding platform with real-time observability and multi-agent orchestration.

[![Docker Pulls](https://img.shields.io/docker/pulls/sidkid78/agentic-workflow)](https://hub.docker.com/r/sidkid78/agentic-workflow)
[![Docker Image Size](https://img.shields.io/docker/image-size/sidkid78/agentic-workflow)](https://hub.docker.com/r/sidkid78/agentic-workflow)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sidkid78/agentic/blob/main/LICENSE)

## 🌟 Features

- **🎯 Mission Control**: AI-powered plan generation and multi-step workflow orchestration
- **👁️ Live Operations**: Real-time agent monitoring with event streaming
- **📊 Debriefing Room**: Compare multiple solution variants with "Best of N" runs
- **🗄️ Armory**: Manage reusable assets (prompts, tools, knowledge bases)
- **🤖 Multi-Agent System**: Deploy specialized agents with different capabilities
- **🌓 Dark/Light Mode**: Beautiful, responsive UI with theme support
- **📈 Usage Analytics**: Track costs, tokens, and performance metrics

## 🚀 Quick Start

### Option 1: Docker Run

```bash
docker run -d \
  --name agentic-workflow \
  -p 3000:3000 \
  -e GEMINI_API_KEY=your_gemini_api_key \
  sidkid78/agentic-workflow:latest
```

Access the application at `http://localhost:3000`

### Option 2: Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  agentic:
    image: sidkid78/agentic-workflow:latest
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    restart: unless-stopped
```

Run:

```bash
docker-compose up -d
```

## 🔧 Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub personal access token | - |
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `DEFAULT_MODEL` | Default AI model | `gemini-2.5-flash` |
| `MAX_CONCURRENT_AGENTS` | Max agents running | `5` |

### Get API Keys

- **Gemini API Key**: [Google AI Studio](https://aistudio.google.com/apikey)
- **GitHub Token**: [GitHub Settings](https://github.com/settings/tokens)

## 📦 Available Tags

| Tag | Description |
|-----|-------------|
| `latest` | Latest stable release |
| `v1.0.0` | Specific version |
| `dev` | Development build |

## 🏗️ Architecture

Built with:
- **Next.js 15** (App Router)
- **React 19** with Server Components
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **Google Gemini** for AI capabilities

## 💡 Use Cases

1. **Automated Code Refactoring**: Generate plans to refactor large codebases
2. **API Development**: Create complete REST APIs with tests and documentation
3. **Testing Suite Generation**: Auto-generate comprehensive test coverage
4. **Code Review**: Deploy agents to analyze and review code changes
5. **Documentation**: Generate and maintain project documentation

## 📊 System Requirements

- **CPU**: 1 core minimum (2+ recommended)
- **Memory**: 512MB minimum (1GB+ recommended)
- **Storage**: 500MB for image + data volumes
- **Network**: Internet access for AI API calls

## 🔍 Health Check

The container includes a built-in health check:

```bash
curl http://localhost:3000/api/health
```

## 🛠️ Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/sidkid78/agentic.git
cd agentic/agentic

# Install dependencies
npm install

# Run development server
npm run dev
```

### Build from Source

```bash
# Build the Docker image
docker build -t agentic-workflow .

# Run the custom build
docker run -d -p 3000:3000 agentic-workflow
```

## 📈 Monitoring

### View Logs

```bash
docker logs -f agentic-workflow
```

### Container Stats

```bash
docker stats agentic-workflow
```

## 🔐 Security

- Runs as non-root user (nextjs:nodejs)
- API keys stored locally, never sent to external servers
- Regular security updates
- Minimal attack surface with alpine base image

## 🌐 Production Deployment

### AWS ECS

```bash
aws ecs create-service \
  --cluster my-cluster \
  --service-name agentic-workflow \
  --task-definition agentic-workflow \
  --desired-count 2
```

### Google Cloud Run

```bash
gcloud run deploy agentic-workflow \
  --image sidkid78/agentic-workflow:latest \
  --platform managed \
  --allow-unauthenticated
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agentic-workflow
spec:
  replicas: 3
  selector:
    matchLabels:
      app: agentic
  template:
    metadata:
      labels:
        app: agentic
    spec:
      containers:
      - name: agentic
        image: sidkid78/agentic-workflow:latest
        ports:
        - containerPort: 3000
```

## 📝 Changelog

### v1.0.0 (2024)
- ✨ Initial release
- 🎯 Mission Control with AI plan generation
- 👁️ Live Operations monitoring
- 📊 Debriefing Room with variant comparison
- 🗄️ Asset management (Armory)
- 🌓 Dark/Light mode
- 📈 Usage analytics

## 🤝 Contributing

Contributions are welcome! Please check out the [GitHub repository](https://github.com/sidkid78/agentic).

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **GitHub**: [github.com/sidkid78/diverse](https://github.com/sidkid78/diverse)
- **Docker Hub**: [hub.docker.com/r/sidkid78/agentic-workflow](https://hub.docker.com/r/sidkid78/agentic-workflow)
- **Documentation**: [Full Docs](https://github.com/sidkid78/diverse/blob/main/README.md)

## 💬 Support

- 🐛 Report bugs: [GitHub Issues](https://github.com/sidkid78/diverse/issues)
- 💡 Feature requests: [GitHub Discussions](https://github.com/sidkid78/diverse/discussions)
- 📧 Email: [Your email]

---

**Made with ❤️ by sidkid78**

