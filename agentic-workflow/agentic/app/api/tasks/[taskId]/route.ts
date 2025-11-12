import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/tasks/[taskId] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const t = await prisma.task.findUnique({
      where: { id: taskId },
      include: { agents: true },
    });

    if (!t) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const task = {
      task_id: t.id,
      plan_id: t.planId,
      title: t.title,
      description: t.description || '',
      status: t.status,
      created_at: t.createdAt.toISOString(),
      updated_at: t.updatedAt.toISOString(),
      agents: t.agents.map((a) => ({
        agent_id: a.id,
        name: a.name,
        status: a.status,
        model_preference: a.modelPreference,
        specialization: a.specialization,
        created_at: a.createdAt.toISOString(),
      })),
      metrics: {
        elapsed_time: t.elapsedTime,
        estimated_cost: t.estimatedCost,
        files_touched: t.filesTouched,
        tests_passed: t.testsPassed,
        tests_failed: t.testsFailed,
      },
    };

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

    const exists = await prisma.task.findUnique({ where: { id: taskId } });
    if (!exists) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        status: body.status ?? undefined,
        elapsedTime: typeof body.elapsed_time === 'number' ? body.elapsed_time : undefined,
        estimatedCost: typeof body.estimated_cost === 'number' ? body.estimated_cost : undefined,
        filesTouched: typeof body.files_touched === 'number' ? body.files_touched : undefined,
        testsPassed: typeof body.tests_passed === 'number' ? body.tests_passed : undefined,
        testsFailed: typeof body.tests_failed === 'number' ? body.tests_failed : undefined,
      },
      include: { agents: true },
    });

    return NextResponse.json({
      task: {
        task_id: updated.id,
        plan_id: updated.planId,
        title: updated.title,
        description: updated.description || '',
        status: updated.status,
        created_at: updated.createdAt.toISOString(),
        updated_at: updated.updatedAt.toISOString(),
        agents: updated.agents.map((a) => ({
          agent_id: a.id,
          name: a.name,
          status: a.status,
          model_preference: a.modelPreference,
          specialization: a.specialization,
          created_at: a.createdAt.toISOString(),
        })),
        metrics: {
          elapsed_time: updated.elapsedTime,
          estimated_cost: updated.estimatedCost,
          files_touched: updated.filesTouched,
          tests_passed: updated.testsPassed,
          tests_failed: updated.testsFailed,
        },
      },
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

    const exists = await prisma.task.findUnique({ where: { id: taskId } });
    if (!exists) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await prisma.task.delete({ where: { id: taskId } });

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
