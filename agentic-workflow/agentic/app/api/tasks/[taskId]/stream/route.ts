import { NextRequest } from 'next/server';

// Mock event data generator
function* generateMockEvents(taskId: string) {
  const agents = [
    { id: 'agent-1', name: 'Code-Analyzer' },
    { id: 'agent-2', name: 'File-Writer' },
    { id: 'agent-3', name: 'Test-Runner' }
  ];

  const eventTypes = [
    'TOOL_CALL',
    'MODEL_CALL', 
    'STATUS_CHANGE',
    'PLAN_UPDATE'
  ];

  const tools = [
    'read_file',
    'write_file',
    'run_command',
    'search_code',
    'analyze_dependencies'
  ];

  let eventId = 0;

  while (true) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    let payload = {};
    
    switch (eventType) {
      case 'TOOL_CALL':
        const tool = tools[Math.floor(Math.random() * tools.length)];
        payload = {
          tool_name: tool,
          file_path: tool === 'read_file' || tool === 'write_file' 
            ? `src/${Math.random() > 0.5 ? 'auth' : 'utils'}/${Math.random() > 0.5 ? 'index' : 'helper'}.ts`
            : undefined,
          args: tool === 'run_command' ? 'npm test' : undefined
        };
        break;
      case 'MODEL_CALL':
        payload = {
          model: 'gemini-2.5-pro',
          tokens_used: Math.floor(Math.random() * 1000) + 100
        };
        break;
      case 'STATUS_CHANGE':
        payload = {
          old_status: 'RUNNING',
          new_status: Math.random() > 0.8 ? 'PAUSED' : 'RUNNING'
        };
        break;
      case 'PLAN_UPDATE':
        payload = {
          step_completed: `Step ${Math.floor(Math.random() * 5) + 1}`,
          progress: Math.floor(Math.random() * 100)
        };
        break;
    }

    yield {
      event_id: `evt-${eventId++}`,
      task_id: taskId,
      agent_id: agent.id,
      agent_name: agent.name,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      payload
    };

    // Random delay between events (1-5 seconds)
    const delay = Math.random() * 4000 + 1000;
    const start = Date.now();
    while (Date.now() - start < delay) {
      // Busy wait for demo purposes
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  
  // Set up Server-Sent Events headers
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Create a readable stream
  const stream = new ReadableStream({
    start(controller) {
      const eventGenerator = generateMockEvents(taskId);
      
      // Send initial connection event
      const connectionEvent = {
        event_id: 'connection',
        task_id: taskId,
        event_type: 'CONNECTION_ESTABLISHED',
        timestamp: new Date().toISOString(),
        payload: { message: 'Connected to task stream' }
      };
      
      controller.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify(connectionEvent)}\n\n`)
      );

      // Function to send events
      const sendEvent = () => {
        try {
          const { value: event, done } = eventGenerator.next();
          
          if (!done && event) {
            const eventData = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(new TextEncoder().encode(eventData));
            
            // Schedule next event
            setTimeout(sendEvent, Math.random() * 3000 + 1000);
          }
        } catch (error) {
          console.error('Error generating event:', error);
          controller.error(error);
        }
      };

      // Start sending events
      setTimeout(sendEvent, 1000);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        console.log(`Client disconnected from task ${taskId} stream`);
        controller.close();
      });
    }
  });

  return new Response(stream, { headers });
}
