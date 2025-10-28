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

    return NextResponse.json({
      task,
      agents,
      events: events.slice(-50), // Last 50 events
      event_count: events.length,
    });

  } catch (error) {
    console.error('Get task status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get task status' },
      { status: 500 }
    );
  }
}

