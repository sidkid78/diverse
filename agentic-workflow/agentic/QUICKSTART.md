# 🚀 Quick Start Guide

Get the Agentic Workflow platform running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- npm or pnpm installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))
- (Optional) GitHub Personal Access Token ([Create one](https://github.com/settings/tokens))

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/sidkid78/diverse.git
cd diverse/agentic
npm install
```

### 2. Set Up Environment

Create `.env.local` file:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Required
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional (but recommended)
GITHUB_TOKEN=your_github_token_here
```

**Get your keys:**
- **Gemini API Key**: Visit https://aistudio.google.com/apikey
  - Sign in with Google
  - Click "Create API Key"
  - Copy and paste into `.env.local`

- **GitHub Token** (Optional): Visit https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Select scopes: `repo`, `read:org`
  - Generate and copy into `.env.local`

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 4. Verify Setup

Open http://localhost:3000/api/health in your browser.

You should see:
```json
{
  "status": "healthy",
  "services": {
    "gemini": { "status": "operational" },
    "github": { "status": "operational" }
  }
}
```

✅ **You're ready!** Go to http://localhost:3000 to start using the platform.

## Docker Deployment

### Quick Docker Start

```bash
# Navigate to project
cd agentic

# Create .env file
cp env.example .env

# Edit .env and add your GEMINI_API_KEY
nano .env

# Start with Docker Compose
docker-compose up -d

# Check health
curl http://localhost:3000/api/health

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Pull from Docker Hub

```bash
# Pull the latest image
docker pull sidkid1978/agentic-workflow:latest

# Run with your API key
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  -e GITHUB_TOKEN=your_token_here \
  sidkid1978/agentic-workflow:latest

# Access at http://localhost:3000
```

## First Mission

### 1. Navigate to Mission Control

Go to http://localhost:3000/plans/new

### 2. Enter Mission Details

- **Mission Statement**: "Add comprehensive logging to the authentication module"
- **Repository URL**: `https://github.com/your-username/your-repo`
- **Model Preference**: Select "Gemini 2.5 Flash"

### 3. Select Context Files

Click "Browse Repository" and select relevant files:
- `src/auth.ts`
- `src/middleware/auth.js`
- etc.

### 4. Generate Plan

Click "Draft Plan with AI" - the platform will:
1. Analyze your repository
2. Understand the mission
3. Generate a multi-step execution plan
4. Assign specialized agents to each step

### 5. Review & Execute

Review the generated plan, then click "Deploy Mission".

### 6. Monitor Progress

Go to "Live Ops" to watch your agents work in real-time!

## Understanding the Interface

### 🎯 Mission Control (`/plans/new`)
- Define your objective
- Connect to repositories
- Generate AI-powered execution plans
- Deploy missions

### 📊 Live Ops (`/tasks`)
- Real-time agent monitoring
- Event stream visualization
- Agent swimlanes showing parallel work
- Performance metrics

### 🔍 Debriefing Room (`/tasks/:taskId/results`)
- Review completed missions
- Compare multiple solution approaches
- Analyze agent performance
- Export results

### 🛠️ Armory (`/armory`)
- Manage reusable assets
- Create prompt templates
- Define agent personas
- Build tool configurations

## API Examples

### Generate a Plan

```bash
curl -X POST http://localhost:3000/api/plans/generate \
  -H "Content-Type: application/json" \
  -d '{
    "mission_statement": "Refactor authentication to use JWT",
    "repo_url": "https://github.com/owner/repo",
    "context_files": ["src/auth.ts"],
    "model_preference": "gemini-2.5-flash"
  }'
```

### Execute a Task

```bash
curl -X POST http://localhost:3000/api/tasks/execute \
  -H "Content-Type: application/json" \
  -d '{
    "plan": [...],
    "repo_url": "https://github.com/owner/repo",
    "context_files": ["src/auth.ts"]
  }'
```

### Stream Real-time Events

```bash
curl -N http://localhost:3000/api/stream?taskId=task-123
```

### Check Health

```bash
curl http://localhost:3000/api/health
```

## Model Selection Guide

### 🧠 Gemini 2.5 Pro
**When to use:**
- Complex architectural decisions
- Critical refactoring
- Security-sensitive code
- Performance optimization

**Characteristics:**
- Highest quality reasoning
- Slower response time
- Higher cost

### 🚀 Gemini 2.5 Flash (Recommended)
**When to use:**
- General implementation tasks
- Documentation generation
- Standard refactoring
- Most everyday tasks

**Characteristics:**
- Excellent quality
- Fast response time
- Best cost/performance ratio

### 💡 Gemini 2.5 Flash Lite
**When to use:**
- Simple formatting
- Basic operations
- Quick iterations

**Characteristics:**
- Good quality
- Very fast
- Lowest cost

### ⚡ Gemini 2.0 Pro
**When to use:**
- Legacy compatibility
- Simple, repetitive tasks

**Characteristics:**
- Good quality
- Fast
- Low cost

## Troubleshooting

### "Gemini API key not configured"

**Solution:** Ensure `GEMINI_API_KEY` is in your `.env.local` file and restart the server:
```bash
npm run dev
```

### "Failed to get repository"

**Solution:** 
1. Check your `GITHUB_TOKEN` is valid
2. Ensure the repository URL is correct
3. Verify you have access to the repository

### API Rate Limits

**Gemini API:** 
- Free tier: 15 requests/minute
- Check https://ai.google.dev/rate-limits

**GitHub API:**
- Authenticated: 5,000 requests/hour
- Unauthenticated: 60 requests/hour

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

## Next Steps

- 📖 Read [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for API details
- 🐳 See [DOCKER.md](./DOCKER.md) for deployment guide
- 🏗️ Check [plans.md](./plans.md) for architecture overview
- 💬 Join discussions on GitHub Issues

## Getting Help

- **Documentation**: https://github.com/sidkid78/diverse/wiki
- **Issues**: https://github.com/sidkid78/diverse/issues
- **Discussions**: https://github.com/sidkid78/diverse/discussions

## Common Issues

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors

```bash
# Check for errors
npm run type-check

# Fix linting
npm run lint:fix
```

### Docker Issues

```bash
# Rebuild image
docker-compose build --no-cache

# Check logs
docker-compose logs -f

# Reset everything
docker-compose down -v
docker system prune -a
```

## Performance Tips

1. **Use appropriate models** - Don't use Pro for simple tasks
2. **Limit context files** - Only include relevant files
3. **Enable caching** - Add Redis for production
4. **Use streaming** - Connect to SSE endpoints for real-time updates
5. **Monitor costs** - Check the Usage page regularly

## Security Best Practices

1. **Never commit API keys** - Always use `.env.local`
2. **Use minimal GitHub scopes** - Only `repo` and `read:org`
3. **Enable rate limiting** - In production environments
4. **Monitor API usage** - Set up billing alerts
5. **Use HTTPS** - In production deployments

Happy Building! 🎉

