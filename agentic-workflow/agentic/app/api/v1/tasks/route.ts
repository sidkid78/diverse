import { NextRequest, NextResponse } from 'next/server';

// Minimal types and in-memory store (dev only)
interface ApiTaskMetrics {
  elapsed_time: number;
  estimated_cost: number;
  files_touched: 0 | number;
  tests_passed: 0 | number;
  tests_failed: 0 | number;
}

interface ApiTask {
  task_id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  created_at: string;
  updated_at: string;
  agents: unknown[];
  run_mode: 'single' | 'best-of-n';
  parallel_runs: number;
  metrics: ApiTaskMetrics;
}

const tasks: ApiTask[] = [];

// GET /api/v1/tasks - list tasks (mock)
export async function GET() {
  return NextResponse.json({ tasks }, { status: 200 });
}

// POST /api/v1/tasks - create a task (mock)
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      description?: string;
      agents?: unknown[];
      run_mode?: 'single' | 'best-of-n';
      parallel_runs?: number;
      estimated_cost?: number;
    };

    const now = new Date().toISOString();
    const task: ApiTask = {
      task_id: `task-${Date.now()}`,
      title: body.title ?? 'Untitled Task',
      description: body.description ?? '',
      status: 'PENDING',
      created_at: now,
      updated_at: now,
      agents: body.agents ?? [],
      run_mode: body.run_mode ?? 'single',
      parallel_runs: body.parallel_runs ?? 1,
      metrics: {
        elapsed_time: 0,
        estimated_cost: body.estimated_cost ?? 0,
        files_touched: 0,
        tests_passed: 0,
        tests_failed: 0,
      },
    };

    tasks.push(task);
    return NextResponse.json({ task, message: 'Task created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}


