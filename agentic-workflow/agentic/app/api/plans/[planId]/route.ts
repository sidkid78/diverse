import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/plans/[planId] - Get a specific plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const { planId } = await params;

    const p = await prisma.plan.findUnique({
      where: { id: planId },
      include: { steps: true },
    });

    if (!p) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    const plan = {
      plan_id: p.id,
      name: p.title,
      description: p.description,
      created_at: p.createdAt.toISOString(),
      updated_at: p.updatedAt.toISOString(),
      steps: p.steps
        .sort((a, b) => a.order - b.order)
        .map((s) => ({
          step_id: s.id,
          title: `Step ${s.order}`,
          description: s.instruction,
          estimated_duration: 0,
          agent_requirements: s.assignedAgents,
        })),
      context_files: [],
      ai_docs: [],
      estimated_cost: 0,
      estimated_duration: 0,
      success_criteria: [],
    };

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

    const exists = await prisma.plan.findUnique({ where: { id: planId } });
    if (!exists) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.plan.update({
      where: { id: planId },
      data: {
        title: body.name ?? undefined,
        description: body.description ?? undefined,
      },
      include: { steps: true },
    });

    return NextResponse.json({
      plan: {
        plan_id: updated.id,
        name: updated.title,
        description: updated.description,
        created_at: updated.createdAt.toISOString(),
        updated_at: updated.updatedAt.toISOString(),
        steps: updated.steps
          .sort((a, b) => a.order - b.order)
          .map((s) => ({
            step_id: s.id,
            title: `Step ${s.order}`,
            description: s.instruction,
            estimated_duration: 0,
            agent_requirements: s.assignedAgents,
          })),
        context_files: [],
        ai_docs: [],
        estimated_cost: 0,
        estimated_duration: 0,
        success_criteria: [],
      },
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

    const exists = await prisma.plan.findUnique({ where: { id: planId } });
    if (!exists) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    await prisma.plan.delete({ where: { id: planId } });

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
    
    // Skip if this is the generate endpoint (should be handled by /api/plans/generate/route.ts)
    if (planId === 'generate') {
      return NextResponse.json(
        { error: 'This endpoint should not handle generate requests' },
        { status: 500 }
      );
    }
    
    const body = await request.json();

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Create a task from the plan in DB
    const created = await prisma.task.create({
      data: {
        planId: plan.id,
        title: plan.title,
        description: plan.description,
        agents: Array.isArray(body.agents) && body.agents.length > 0 ? {
          create: body.agents.map((a: any) => ({
            name: a.name || 'Agent',
            status: 'PENDING',
            modelPreference: a.model_preference || 'gemini-2.5-flash',
            specialization: Array.isArray(a.specialization) ? a.specialization : [],
          })),
        } : undefined,
      },
      include: { agents: true },
    });

    return NextResponse.json({
      task: {
        task_id: created.id,
        plan_id: created.planId,
        title: created.title,
        description: created.description || '',
        status: created.status,
        created_at: created.createdAt.toISOString(),
        updated_at: created.updatedAt.toISOString(),
        agents: created.agents.map((a) => ({
          agent_id: a.id,
          name: a.name,
          status: a.status,
          model_preference: a.modelPreference,
          specialization: a.specialization,
          created_at: a.createdAt.toISOString(),
        })),
        metrics: {
          elapsed_time: created.elapsedTime,
          estimated_cost: created.estimatedCost,
          files_touched: created.filesTouched,
          tests_passed: created.testsPassed,
          tests_failed: created.testsFailed,
        },
      },
      message: `Plan "${plan.title}" execution started`,
    }, { status: 201 });
  } catch (error) {
    console.error('Error executing plan:', error);
    return NextResponse.json(
      { error: 'Failed to execute plan' },
      { status: 500 }
    );
  }
}
