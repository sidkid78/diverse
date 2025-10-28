# 🤖 Agentic Workflow Platform

> **AI-Powered Multi-Agent System for Software Development**

Transform complex software development tasks into orchestrated multi-agent workflows powered by Google Gemini AI.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://hub.docker.com/r/sidkid1978/agentic-workflow)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## ✨ Features

### 🎯 Mission Control

- **AI-Powered Planning**: Automatically generate multi-step execution plans
- **Repository Integration**: Connect to GitHub repositories seamlessly
- **Smart Context**: AI analyzes your codebase to understand the task
- **Flexible Models**: Choose from Gemini 2.5 Pro, Flash, or Lite

### 📊 Live Operations

- **Real-Time Monitoring**: Watch agents work in real-time via Server-Sent Events
- **Agent Swimlanes**: Visualize parallel agent execution
- **Event Streaming**: See every action, decision, and output as it happens
- **Performance Metrics**: Track cost, duration, and resource usage

### 🔍 Debriefing Room

- **Solution Comparison**: Review multiple approaches side-by-side
- **Detailed Analysis**: Understand what each agent accomplished
- **Export Results**: Download solutions and metrics
- **Learning Insights**: See how agents solved the problem

### 🛠️ Armory

- **Asset Management**: Reusable prompts, personas, and configurations
- **Tool Library**: Build and share agent capabilities
- **Template System**: Quick-start with proven patterns
- **Version Control**: Track changes to your assets

## 🚀 Quick Start

### Option 1: Local Development

```bash
# Clone the repository
git clone https://github.com/sidkid78/diverse.git
cd agentic-workflows/agentic

# Install dependencies
npm install

# Set up environment
cp env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Start development server
npm run dev
```

Visit http://localhost:3000

### Option 2: Docker

```bash
# Pull from Docker Hub
docker pull sidkid1978/agentic-workflow:latest

# Run with your API key
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  sidkid1978/agentic-workflow:latest
```

### Option 3: Docker Compose

```bash
# Clone and navigate
git clone https://github.com/sidkid78/diverse.git
cd diverse/agentic

# Create .env file
cp env.example .env
# Add your GEMINI_API_KEY to .env

# Start services
docker-compose up -d
```

📖 **Detailed Instructions**: See [QUICKSTART.md](./QUICKSTART.md)

## 📋 Prerequisites

- **Gemini API Key** (Required): [Get one here](https://aistudio.google.com/apikey)
- **GitHub Token** (Optional): [Create one](https://github.com/settings/tokens)
- Node.js 20+ (for local development)
- Docker 20.10+ (for Docker deployment)

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Frontend (Next.js 15)               │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Mission    │  │   Live Ops   │  │ Debriefing │ │
│  │   Control    │  │   Monitor    │  │    Room    │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────┬────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │    API Routes (SSE)     │
         └────────────┬────────────┘
                      │
         ┌────────────┴────────────┐
         │   Backend Services      │
         │  ┌──────────────────┐   │
         │  │ AgentOrchestrator│   │
         │  │  PlanExecutor    │   │
         │  │  EventLogger     │   │
         │  └──────────────────┘   │
         └───┬──────────────┬──────┘
             │              │
    ┌────────┴────┐    ┌───┴──────┐
    │  Gemini API │    │ GitHub   │
    │  (AI Models)│    │   API    │
    └─────────────┘    └──────────┘
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Version Control**: [GitHub API](https://docs.github.com/en/rest)
- **Real-time**: Server-Sent Events (SSE)
- **Deployment**: Docker + Docker Compose

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - API and services guide
- **[DOCKER.md](./DOCKER.md)** - Docker deployment details
- **[DOCKER_SCOUT_SETUP.md](./DOCKER_SCOUT_SETUP.md)** - Docker Scout environment setup
- **[DOCKER_SCOUT_COMMANDS.md](./DOCKER_SCOUT_COMMANDS.md)** - Scout commands reference
- **[plans.md](./plans.md)** - Architecture and design philosophy
- **[DOCKER_COMMANDS.md](./DOCKER_COMMANDS.md)** - Docker reference

## 🎮 Usage Examples

### Generate an AI Plan

```typescript
const response = await fetch('/api/plans/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mission_statement: 'Add authentication to the API',
    repo_url: 'https://github.com/owner/repo',
    context_files: ['src/server.ts', 'src/routes/api.ts'],
    model_preference: 'gemini-2.5-flash'
  })
});

const { plan } = await response.json();
```

### Execute a Task

```typescript
const response = await fetch('/api/tasks/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plan: generatedPlan,
    repo_url: 'https://github.com/owner/repo',
    context_files: ['src/server.ts']
  })
});

const { task_id, stream_url } = await response.json();
```

### Stream Real-Time Events

```typescript
const eventSource = new EventSource(`/api/stream?taskId=${taskId}`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Agent event:', data.event_type);
};
```

## 🔑 Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional
GITHUB_TOKEN=your_github_token
DEFAULT_MODEL=gemini-2.5-flash
MAX_CONCURRENT_AGENTS=5
DEFAULT_REPO=https://github.com/your/repo
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🐳 Docker

```bash
# Build image
docker build -t agentic-workflow .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key agentic-workflow

# Use Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Google Gemini](https://ai.google.dev/) - AI models
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Primitives

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/sidkid78/diverse/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sidkid78/diverse/discussions)
- **Documentation**: [Wiki](https://github.com/sidkid78/diverse/wiki)

## 🗺️ Roadmap

- [ ] Database persistence (SQLite/PostgreSQL)
- [ ] User authentication and multi-tenancy
- [ ] Cost tracking and budgets
- [ ] Agent result caching
- [ ] Webhook notifications
- [ ] VS Code extension
- [ ] CLI interface
- [ ] Team collaboration features

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

---

**Built with ❤️ using Next.js, TypeScript, and Google Gemini AI**
