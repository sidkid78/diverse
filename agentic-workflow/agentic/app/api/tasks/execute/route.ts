/**
 * Task Execution API
 * Execute plans using real backend services
 */

import { NextRequest, NextResponse } from 'next/server';
import { planExecutor, eventLogger, agentOrchestrator } from '@/lib/services';
import type { GeneratedPlanStep } from '@/lib/services/PlanExecutor';

export const runtime = 'nodejs';

/**
 * POST /api/tasks/execute
 * Execute a plan and create a new task
 * 
 * Body:
 * - plan: GeneratedPlanStep[] - The plan steps to execute
 * - repo_url: string - Repository URL
 * - context_files: string[] - Files to include in context
 * - additional_instructions?: string - Extra instructions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, repo_url, context_files, additional_instructions } = body;

    // Validate request
    if (!plan || !Array.isArray(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan: must be an array of plan steps' },
        { status: 400 }
      );
    }

    if (!repo_url) {
      return NextResponse.json(
        { error: 'repo_url is required' },
        { status: 400 }
      );
    }

    if (!context_files || !Array.isArray(context_files)) {
      return NextResponse.json(
        { error: 'context_files is required and must be an array' },
        { status: 400 }
      );
    }

    // Connect event logger to both orchestrator and executor
    agentOrchestrator.onEvent((event) => {
      eventLogger.logEvent(event);
    });

    planExecutor.onEvent((event) => {
      eventLogger.logEvent(event);
    });

    // Create and start task execution
    const task = await planExecutor.createTask(plan as GeneratedPlanStep[], {
      repo_url,
      context_files,
      additional_instructions,
    });

    // Execute the plan asynchronously (don't await)
    planExecutor.executePlan(task.task_id).catch((error) => {
      console.error('Task execution error:', error);
    });

    // Return task info immediately
    return NextResponse.json({
      task_id: task.task_id,
      status: task.status,
      created_at: task.created_at,
      stream_url: `/api/stream?taskId=${task.task_id}`,
    }, { status: 201 });

  } catch (error) {
    console.error('Execute task error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute task' },
      { status: 500 }
    );
  }
}

