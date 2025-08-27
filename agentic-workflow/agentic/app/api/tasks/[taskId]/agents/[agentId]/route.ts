import { NextRequest, NextResponse } from 'next/server';

// POST /api/tasks/[taskId]/agents/[agentId] - Control agent actions
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; agentId: string }> }
) {
  try {
    const { taskId, agentId } = await params;
    const body = await request.json();
    const { action, payload } = body;

    // Validate action
    const validActions = ['start', 'pause', 'resume', 'stop', 'steer', 'restart'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    // Simulate agent control
    let result = {};
    let message = '';

    switch (action) {
      case 'start':
        result = { status: 'RUNNING', started_at: new Date().toISOString() };
        message = `Agent ${agentId} started successfully`;
        break;
      
      case 'pause':
        result = { status: 'PAUSED', paused_at: new Date().toISOString() };
        message = `Agent ${agentId} paused successfully`;
        break;
      
      case 'resume':
        result = { status: 'RUNNING', resumed_at: new Date().toISOString() };
        message = `Agent ${agentId} resumed successfully`;
        break;
      
      case 'stop':
        result = { status: 'STOPPED', stopped_at: new Date().toISOString() };
        message = `Agent ${agentId} stopped successfully`;
        break;
      
      case 'steer':
        const { instructions } = payload || {};
        if (!instructions) {
          return NextResponse.json(
            { error: 'Steering requires instructions in payload' },
            { status: 400 }
          );
        }
        result = { 
          status: 'RUNNING', 
          steering_applied: true,
          instructions,
          steered_at: new Date().toISOString()
        };
        message = `Agent ${agentId} steering applied: "${instructions}"`;
        break;
      
      case 'restart':
        result = { 
          status: 'RUNNING', 
          restarted: true,
          restarted_at: new Date().toISOString()
        };
        message = `Agent ${agentId} restarted successfully`;
        break;
    }

    // Log the action (in production, this would update the database)
    console.log(`Agent Control - Task: ${taskId}, Agent: ${agentId}, Action: ${action}`, result);

    return NextResponse.json({
      task_id: taskId,
      agent_id: agentId,
      action,
      result,
      message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error controlling agent:', error);
    return NextResponse.json(
      { error: 'Failed to control agent' },
      { status: 500 }
    );
  }
}

// GET /api/tasks/[taskId]/agents/[agentId] - Get agent status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; agentId: string }> }
) {
  try {
    const { taskId, agentId } = await params;

    // Mock agent data
    const mockAgent = {
      agent_id: agentId,
      task_id: taskId,
      name: `Agent-${agentId}`,
      status: 'RUNNING',
      model_preference: 'gemini-2.5-flash',
      specialization: ['analysis', 'implementation'],
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date().toISOString(),
      current_activity: 'Analyzing authentication flow',
      metrics: {
        tokens_used: 15420,
        api_calls: 28,
        files_processed: 5,
        runtime_seconds: 1800
      },
      workspace: {
        current_directory: '/workspace/auth-refactor',
        active_files: [
          'src/auth/controller.ts',
          'src/middleware/auth.ts',
          'tests/auth.test.ts'
        ]
      }
    };

    return NextResponse.json({ agent: mockAgent });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}
