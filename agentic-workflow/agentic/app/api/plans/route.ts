import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/plans - List plans (DB-backed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const take = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('offset') || '0');

    const [plans, total] = await Promise.all([
      prisma.plan.findMany({
        where: search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
        include: { steps: true },
      }),
      prisma.plan.count({
        where: search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
      }),
    ]);

    const apiPlans = plans.map((p) => ({
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
    }));

    return NextResponse.json({
      plans: apiPlans,
      total,
      limit: take,
      offset: skip,
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

// POST /api/plans - Create plan (DB-backed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, steps } = body;

    if (!name || !description || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, steps' },
        { status: 400 }
      );
    }

    const created = await prisma.plan.create({
      data: {
        title: name,
        description,
        steps: {
          create: steps.map((s: any, idx: number) => ({
            order: idx + 1,
            instruction: s.description || s.instruction || s.title || `Step ${idx + 1}`,
            assignedAgents: Array.isArray(s.agent_requirements) ? s.agent_requirements : [],
            contextFiles: Array.isArray(s.context_files) ? s.context_files : [],
          })),
        },
      },
      include: { steps: true },
    });

    const apiPlan = {
      plan_id: created.id,
      name: created.title,
      description: created.description,
      created_at: created.createdAt.toISOString(),
      updated_at: created.updatedAt.toISOString(),
      steps: created.steps
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

    return NextResponse.json(apiPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}