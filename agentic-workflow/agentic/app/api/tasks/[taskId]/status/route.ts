/**
 * Task Status API
 * Get detailed status information for a specific task
 */

import { NextRequest, NextResponse } from 'next/server';
import { planExecutor, agentOrchestrator, eventLogger } from '@/lib/services';

export const runtime = 'nodejs';

/**
 * GET /api/tasks/:taskId/status
 * Get task status with agents and events
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    // Get task
    const task = planExecutor.getTask(taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Get agents for this task
    const agents = agentOrchestrator.getAgentsByTask(taskId);

    // Get recent events for this task
    const events = eventLogger.getEventsByTask(taskId);

    // Aggregate estimated costs (from emitted PLAN_UPDATE events)
    const totals = events.reduce(
      (acc, ev) => {
        const p = ev.payload || {};
        const inCost = typeof (p as any).estimated_input_cost_usd === 'number' ? (p as any).estimated_input_cost_usd : 0;
        const outCost = typeof (p as any).estimated_output_cost_usd === 'number' ? (p as any).estimated_output_cost_usd : 0;
        return {
          estimated_input_cost_usd: acc.estimated_input_cost_usd + inCost,
          estimated_output_cost_usd: acc.estimated_output_cost_usd + outCost,
        };
      },
      { estimated_input_cost_usd: 0, estimated_output_cost_usd: 0 }
    );
    const estimated_total_cost_usd = Number((totals.estimated_input_cost_usd + totals.estimated_output_cost_usd).toFixed(6));

    const taskWithCost = {
      ...task,
      metrics: {
        ...task.metrics,
        estimated_cost: Math.round(estimated_total_cost_usd * 100),
      },
    };

    return NextResponse.json({
      task: taskWithCost,
      agents,
      events: events.slice(-50), // Last 50 events
      event_count: events.length,
      cost: {
        estimated_input_cost_usd: Number(totals.estimated_input_cost_usd.toFixed(6)),
        estimated_output_cost_usd: Number(totals.estimated_output_cost_usd.toFixed(6)),
        estimated_total_cost_usd,
      },
    });

  } catch (error) {
    console.error('Get task status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get task status' },
      { status: 500 }
    );
  }
}

