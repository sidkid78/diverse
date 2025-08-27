import { NextRequest, NextResponse } from 'next/server';

// Mock database - same as in route.ts (in production, this would be shared)
const mockTasks = [
  {
    task_id: 'task-1',
    plan_id: 'plan-1',
    title: 'Authentication Refactor',
    description: 'Refactor user authentication flow to use JWT instead of session cookies',
    status: 'IN_PROGRESS',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    agents: [
      {
        agent_id: 'agent-1',
        name: 'Code-Analyzer',
        status: 'RUNNING',
        model_preference: 'gemini-2.5-flash',
        specialization: ['analysis', 'refactoring'],
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        agent_id: 'agent-2',
        name: 'File-Writer',
        status: 'RUNNING',
        model_preference: 'gemini-2.0-pro',
        specialization: ['implementation', 'testing'],
        created_at: new Date(Date.now() - 3000000).toISOString()
      }
    ],
    metrics: {
      elapsed_time: 2400000,
      estimated_cost: 1250,
      files_touched: 8,
      tests_passed: 15,
      tests_failed: 2
    }
  }
];

// GET /api/tasks/[taskId] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    
    const task = mockTasks.find(t => t.task_id === taskId);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[taskId] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    
    const taskIndex = mockTasks.findIndex(t => t.task_id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Update task
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      task: mockTasks[taskIndex],
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[taskId] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    
    const taskIndex = mockTasks.findIndex(t => t.task_id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Remove task
    mockTasks.splice(taskIndex, 1);

    return NextResponse.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
