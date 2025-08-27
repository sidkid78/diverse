import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production this would be a real database
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
        model_preference: 'gemini-2.5-pro',
        specialization: ['analysis', 'refactoring'],
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        agent_id: 'agent-2',
        name: 'File-Writer',
        status: 'RUNNING',
        model_preference: 'gemini-2.5-flash',
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
  },
  {
    task_id: 'task-2',
    plan_id: 'plan-2',
    title: 'API Documentation Update',
    description: 'Generate comprehensive API documentation for the new endpoints',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    agents: [
      {
        agent_id: 'agent-3',
        name: 'Doc-Generator',
        status: 'COMPLETED',
        model_preference: 'gemini-2.0-pro',
        specialization: ['documentation', 'analysis'],
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    metrics: {
      elapsed_time: 1800000,
      estimated_cost: 850,
      files_touched: 12,
      tests_passed: 25,
      tests_failed: 0
    }
  }
];

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredTasks = [...mockTasks];

    // Filter by status if provided
    if (status && status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    // Apply pagination
    const paginatedTasks = filteredTasks.slice(offset, offset + limit);

    return NextResponse.json({
      tasks: paginatedTasks,
      total: filteredTasks.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan_id, title, description, agents } = body;

    // Validate required fields
    if (!plan_id || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: plan_id, title, description' },
        { status: 400 }
      );
    }

    // Create new task
    const newTask = {
      task_id: `task-${Date.now()}`,
      plan_id,
      title,
      description,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      agents: agents || [],
      metrics: {
        elapsed_time: 0,
        estimated_cost: 0,
        files_touched: 0,
        tests_passed: 0,
        tests_failed: 0
      }
    };

    // Add to mock database
    mockTasks.push(newTask);

    return NextResponse.json({
      task: newTask,
      message: 'Task created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
