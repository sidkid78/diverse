# Backend Integration Guide

This document explains how the Agentic Workflow platform integrates with real backend services (Google Gemini and GitHub).

## Overview

The platform now uses real AI models and GitHub API instead of mock data. This enables:

- ✅ Real AI-powered plan generation using Gemini
- ✅ Actual code analysis from GitHub repositories
- ✅ Live agent execution with streaming updates
- ✅ Real-time event monitoring via Server-Sent Events

## Architecture

```
┌─────────────────┐
│   Frontend UI   │
│  (React/Next)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Routes    │
│  (Next.js API)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ Backend Services│────▶│  Gemini API  │
│                 │     └──────────────┘
│ - Orchestrator  │     
│ - PlanExecutor  │     ┌──────────────┐
│ - EventLogger   │────▶│  GitHub API  │
└─────────────────┘     └──────────────┘
```

## Setup

### 1. API Keys

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

### 2. Get Gemini API Key

1. Visit https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add to `.env.local`:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Get GitHub Token (Optional)

1. Visit https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:org`
4. Generate and copy the token
5. Add to `.env.local`:

```env
GITHUB_TOKEN=your_github_token_here
```

### 4. Verify Setup

Start the development server:

```bash
npm run dev
```

Check health status:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "gemini": { "status": "operational" },
    "github": { "status": "operational" }
  }
}
```

## API Endpoints

### Health Check

```http
GET /api/health
```

Returns system status and API key validation.

### Plan Generation

```http
POST /api/plans/generate
Content-Type: application/json

{
  "mission_statement": "Add user authentication",
  "repo_url": "https://github.com/owner/repo",
  "context_files": ["src/app.ts", "src/auth.ts"],
  "model_preference": "gemini-2.5-flash"
}
```

Response:
```json
{
  "plan": [
    {
      "step_description": "Analyze current auth structure",
      "agent_name": "Auth-Analyzer",
      "agent_specialization": ["authentication", "security"],
      "model_preference": "gemini-2.5-pro",
      "estimated_duration": 15,
      "dependencies": []
    }
  ],
  "context_files": ["src/app.ts", "src/auth.ts"],
  "model_used": "gemini-2.5-flash"
}
```

### Task Execution

```http
POST /api/tasks/execute
Content-Type: application/json

{
  "plan": [...],
  "repo_url": "https://github.com/owner/repo",
  "context_files": ["src/app.ts"]
}
```

Response:
```json
{
  "task_id": "task-abc123",
  "status": "RUNNING",
  "created_at": "2024-01-15T10:30:00Z",
  "stream_url": "/api/stream?taskId=task-abc123"
}
```

### Task Status

```http
GET /api/tasks/:taskId/status
```

Returns detailed task information including agents and events.

### Real-time Event Stream (SSE)

```http
GET /api/stream?taskId=task-abc123
Accept: text/event-stream
```

Streams real-time events:
```
data: {"event_type":"agent_spawned","agent_id":"agent-1","timestamp":"..."}

data: {"event_type":"agent_thinking","agent_id":"agent-1","data":{"prompt":"..."}}

data: {"event_type":"agent_completed","agent_id":"agent-1","data":{"result_length":1234}}
```

### GitHub Repository Info

```http
GET /api/github/repo?url=https://github.com/owner/repo
```

### GitHub Files

```http
GET /api/github/files?url=https://github.com/owner/repo
```

List all files in repository (filtered).

```http
GET /api/github/files?url=https://github.com/owner/repo&path=src/app.ts
```

Get specific file content.

## Services

### AgentOrchestrator

Manages agent lifecycle:

```typescript
import { agentOrchestrator } from '@/lib/services';

// Create agent
const agent = agentOrchestrator.createAgent({
  name: 'Code-Analyzer',
  specialization: ['analysis'],
  model_preference: 'gemini-2.5-pro',
  task_id: 'task-123',
});

// Execute agent
const result = await agentOrchestrator.executeAgent(
  agent.agent_id,
  'Analyze this code...',
  'You are a code analysis expert...'
);
```

### PlanExecutor

Executes multi-step plans:

```typescript
import { planExecutor } from '@/lib/services';

// Create task
const task = await planExecutor.createTask(plan, {
  repo_url: 'https://github.com/owner/repo',
  context_files: ['src/app.ts'],
});

// Execute plan
await planExecutor.executePlan(task.task_id);
```

### EventLogger

Manages event streaming:

```typescript
import { eventLogger } from '@/lib/services';

// Subscribe to events
eventLogger.subscribe('client-123', (event) => {
  console.log('New event:', event);
});

// Create SSE stream
const stream = eventLogger.createSSEStream('task-123');
```

## Event Types

- `task_started` - Task execution begins
- `agent_spawned` - New agent created
- `agent_thinking` - Agent processing prompt
- `agent_completed` - Agent finished successfully
- `step_started` - Plan step begins
- `step_completed` - Plan step finished
- `status_change` - Agent status updated
- `error_encountered` - Error occurred
- `task_completed` - Task finished

## Models

### gemini-2.5-pro
- **Use for:** Complex reasoning, architecture decisions, critical refactoring
- **Cost:** High
- **Speed:** Slower
- **Quality:** Highest

### gemini-2.5-flash
- **Use for:** General implementation, documentation, standard tasks
- **Cost:** Medium
- **Speed:** Fast
- **Quality:** High

### gemini-2.5-flash-lite
- **Use for:** Simple formatting, basic operations
- **Cost:** Low
- **Speed:** Very fast
- **Quality:** Good

### gemini-2.0-pro
- **Use for:** Legacy compatibility, simple tasks
- **Cost:** Low
- **Speed:** Fast
- **Quality:** Good

## Error Handling

All API routes handle errors gracefully:

```typescript
try {
  // API call
} catch (error) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Unknown error' },
    { status: 500 }
  );
}
```

## Rate Limits

- **Gemini API:** Check https://ai.google.dev/rate-limits
- **GitHub API:** 5,000 requests/hour (authenticated)

## Security

- API keys are never exposed to the client
- All sensitive operations happen server-side
- GitHub token requires minimal scopes (`repo`, `read:org`)
- CORS headers configured for security

## Development

Run tests:
```bash
npm test
```

Check linting:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

## Troubleshooting

### "Gemini API key not configured"

Ensure `GEMINI_API_KEY` is set in `.env.local` and restart the server.

### "GitHub token not configured"

GitHub integration is optional. Set `GITHUB_TOKEN` if you need repository access.

### SSE connection drops

This is normal for long-running tasks. The client should reconnect automatically.

### Rate limit errors

Wait for the rate limit to reset or upgrade your API plan.

## Next Steps

- [ ] Add database persistence (SQLite/PostgreSQL)
- [ ] Implement user authentication
- [ ] Add cost tracking and budgets
- [ ] Implement agent result caching
- [ ] Add webhook notifications

## Support

For issues and questions:
- GitHub: https://github.com/sidkid78/diverse
- Docs: https://github.com/sidkid78/diverse/wiki

