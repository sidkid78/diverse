/**
 * Server-Sent Events (SSE) Streaming API
 * Provides real-time event streaming for task monitoring
 */

import { NextRequest } from 'next/server';
import { eventLogger } from '@/lib/services';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/stream - Create SSE stream
 * Query params:
 *   - taskId (optional): Filter events for specific task
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get('taskId') || undefined;

  // Create the SSE stream
  const stream = eventLogger.createSSEStream(taskId);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for Nginx
    },
  });
}

