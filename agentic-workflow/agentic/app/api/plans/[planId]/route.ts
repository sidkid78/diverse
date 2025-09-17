import { NextRequest, NextResponse } from 'next/server';

// Mock plans database (same as in route.ts - in production, this would be shared)
const mockPlans = [
  {
    plan_id: 'plan-1',
    name: 'JWT Authentication Migration',
    description: 'Migrate from session-based to JWT authentication',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    author: 'Sarah Chen',
    tags: ['authentication', 'jwt', 'migration', 'security'],
    steps: [
      {
        step_id: 'step-1',
        title: 'Analysis Phase',
        description: 'Analyze current session-based authentication implementation',
        estimated_duration: 1800,
        agent_requirements: ['analysis', 'security-review']
      },
      {
        step_id: 'step-2',
        title: 'JWT Implementation',
        description: 'Implement JWT token generation and validation',
        estimated_duration: 3600,
        agent_requirements: ['backend-development', 'security']
      }
    ],
    context_files: [
      { file_path: 'src/auth/', description: 'Current authentication logic' }
    ],
    ai_docs: [
      { doc_id: 'jwt-best-practices', title: 'JWT Security Best Practices' }
    ],
    estimated_cost: 2500,
    estimated_duration: 9600,
    success_criteria: ['All existing tests pass']
  }
];

// GET /api/plans/[planId] - Get a specific plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;
    
    const plan = mockPlans.find(p => p.plan_id === planId);
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}

// PUT /api/plans/[planId] - Update a plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;
    const body = await request.json();
    
    const planIndex = mockPlans.findIndex(p => p.plan_id === planId);
    
    if (planIndex === -1) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Recalculate estimates if steps changed
    if (body.steps) {
      const estimated_duration = body.steps.reduce(
        (sum: number, step: { estimated_duration?: number }) =>
          sum + (step.estimated_duration ?? 0),
        0
      );
      body.estimated_cost = Math.floor(estimated_duration * 0.25);
      body.estimated_duration = estimated_duration;
    }

    // Update plan
    mockPlans[planIndex] = {
      ...mockPlans[planIndex],
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      plan: mockPlans[planIndex],
      message: 'Plan updated successfully'
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/[planId] - Delete a plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;
    
    const planIndex = mockPlans.findIndex(p => p.plan_id === planId);
    
    if (planIndex === -1) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Remove plan
    mockPlans.splice(planIndex, 1);

    return NextResponse.json({
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete plan' },
      { status: 500 }
    );
  }
}

// POST /api/plans/[planId]/execute - Execute a plan (create task)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;
    const body = await request.json();
    
    const plan = mockPlans.find(p => p.plan_id === planId);
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Create a task from the plan
    const task = {
      task_id: `task-${Date.now()}`,
      plan_id: planId,
      title: plan.name,
      description: plan.description,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      agents: body.agents || [],
      run_mode: body.run_mode || 'single',
      parallel_runs: body.parallel_runs || 1,
      metrics: {
        elapsed_time: 0,
        estimated_cost: plan.estimated_cost,
        files_touched: 0,
        tests_passed: 0,
        tests_failed: 0
      }
    };

    // In production, this would call the tasks API or directly create in database
    console.log('Plan execution started:', task);

    return NextResponse.json({
      task,
      message: `Plan "${plan.name}" execution started`
    }, { status: 201 });
  } catch (error) {
    console.error('Error executing plan:', error);
    return NextResponse.json(
      { error: 'Failed to execute plan' },
      { status: 500 }
    );
  }
}
