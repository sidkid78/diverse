import { NextRequest, NextResponse } from 'next/server';

// Minimal in-memory store (dev only)
const tasks: any[] = [];

// GET /api/v1/tasks - list tasks (mock)
export async function GET() {
  return NextResponse.json({ tasks });
}

// POST /api/v1/tasks - create a task (mock)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as Record<string, unknown>));

    const now = new Date().toISOString();
    const task = {
      task_id: `task-${Date.now()}`,
      title: (body as any)?.title ?? 'Untitled Task',
      description: (body as any)?.description ?? '',
      status: 'PENDING',
      created_at: now,
      updated_at: now,
      agents: (body as any)?.agents ?? [],
      run_mode: (body as any)?.run_mode ?? 'single',
      parallel_runs: (body as any)?.parallel_runs ?? 1,
      metrics: {
        elapsed_time: 0,
        estimated_cost: (body as any)?.estimated_cost ?? 0,
        files_touched: 0,
        tests_passed: 0,
        tests_failed: 0,
      },
    };

    tasks.push(task);
    return NextResponse.json({ task, message: 'Task created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}


