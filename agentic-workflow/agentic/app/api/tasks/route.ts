import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/tasks - List all tasks (DB-backed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const take = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('offset') || '0');

    const where = status && status !== 'all'
      ? { status }
      : {};

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
        include: {
          agents: true,
        },
      }),
      prisma.task.count({ where }),
    ]);

    // Map DB entities to API shape
    const apiTasks = tasks.map((t) => ({
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
    }));

    return NextResponse.json({
      tasks: apiTasks,
      total,
      limit: take,
      offset: skip,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task (DB-backed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan_id, title, description, agents } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    const created = await prisma.task.create({
      data: {
        planId: plan_id || null,
        title,
        description,
        // Agents are optional; if provided, create them
        agents: Array.isArray(agents) && agents.length > 0 ? {
          create: agents.map((a: any) => ({
            name: a.name || 'Agent',
            status: 'PENDING',
            modelPreference: a.model_preference || 'gemini-2.5-flash',
            specialization: Array.isArray(a.specialization) ? a.specialization : [],
          })),
        } : undefined,
      },
      include: { agents: true },
    });

    const apiTask = {
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
      message: 'Task created successfully',
    };

    return NextResponse.json(apiTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
