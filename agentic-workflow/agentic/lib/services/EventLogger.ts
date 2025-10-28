/**
 * Event Logger Service
 * Manages event streaming and storage for real-time monitoring
 */

import { v4 as uuidv4 } from 'uuid';
import type { EventLog } from '@/types';

export class EventLogger {
  private events: EventLog[];
  private eventsByTask: Map<string, EventLog[]>;
  private eventsByAgent: Map<string, EventLog[]>;
  private streamCallbacks: Map<string, (event: EventLog) => void>;

  constructor() {
    this.events = [];
    this.eventsByTask = new Map();
    this.eventsByAgent = new Map();
    this.streamCallbacks = new Map();
  }

  /**
   * Log a new event
   */
  logEvent(event: Omit<EventLog, 'event_id' | 'timestamp'>): EventLog {
    const fullEvent: EventLog = {
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...event,
    };

    // Store in main events array
    this.events.push(fullEvent);

    // Index by task
    const taskEvents = this.eventsByTask.get(fullEvent.task_id) || [];
    taskEvents.push(fullEvent);
    this.eventsByTask.set(fullEvent.task_id, taskEvents);

    // Index by agent if applicable
    if (fullEvent.agent_id) {
      const agentEvents = this.eventsByAgent.get(fullEvent.agent_id) || [];
      agentEvents.push(fullEvent);
      this.eventsByAgent.set(fullEvent.agent_id, agentEvents);
    }

    // Notify stream subscribers
    this.notifySubscribers(fullEvent);

    return fullEvent;
  }

  /**
   * Subscribe to event stream
   */
  subscribe(clientId: string, callback: (event: EventLog) => void) {
    this.streamCallbacks.set(clientId, callback);
  }

  /**
   * Unsubscribe from event stream
   */
  unsubscribe(clientId: string) {
    this.streamCallbacks.delete(clientId);
  }

  /**
   * Notify all stream subscribers of a new event
   */
  private notifySubscribers(event: EventLog) {
    this.streamCallbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  /**
   * Get all events
   */
  getAllEvents(): EventLog[] {
    return [...this.events];
  }

  /**
   * Get events for a specific task
   */
  getEventsByTask(taskId: string): EventLog[] {
    return this.eventsByTask.get(taskId) || [];
  }

  /**
   * Get events for a specific agent
   */
  getEventsByAgent(agentId: string): EventLog[] {
    return this.eventsByAgent.get(agentId) || [];
  }

  /**
   * Get recent events (last N)
   */
  getRecentEvents(limit = 100): EventLog[] {
    return this.events.slice(-limit);
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: EventLog['event_type']): EventLog[] {
    return this.events.filter((event) => event.event_type === eventType);
  }

  /**
   * Get events in time range
   */
  getEventsByTimeRange(startTime: string, endTime: string): EventLog[] {
    return this.events.filter(
      (event) => event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  /**
   * Clear events for a specific task
   */
  clearTaskEvents(taskId: string) {
    this.eventsByTask.delete(taskId);
    this.events = this.events.filter((event) => event.task_id !== taskId);
  }

  /**
   * Clear all events
   */
  clearAll() {
    this.events = [];
    this.eventsByTask.clear();
    this.eventsByAgent.clear();
  }

  /**
   * Get event statistics
   */
  getStatistics() {
    const eventsByType: Record<string, number> = {};
    const eventsByTask: Record<string, number> = {};

    this.events.forEach((event) => {
      eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;
      eventsByTask[event.task_id] = (eventsByTask[event.task_id] || 0) + 1;
    });

    return {
      total_events: this.events.length,
      events_by_type: eventsByType,
      events_by_task: eventsByTask,
      active_subscribers: this.streamCallbacks.size,
    };
  }

  /**
   * Create a Server-Sent Events stream
   */
  createSSEStream(taskId?: string): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();

    return new ReadableStream({
      start: (controller) => {
        const clientId = uuidv4();

        // Send initial connection message
        const connectMessage = `data: ${JSON.stringify({
          type: 'connected',
          timestamp: new Date().toISOString(),
        })}\n\n`;
        controller.enqueue(encoder.encode(connectMessage));

        // Subscribe to events
        this.subscribe(clientId, (event) => {
          // Filter by task if specified
          if (taskId && event.task_id !== taskId) {
            return;
          }

          const message = `data: ${JSON.stringify(event)}\n\n`;
          try {
            controller.enqueue(encoder.encode(message));
          } catch (error) {
            console.error('Error sending SSE message:', error);
          }
        });

        // Send historical events for the task
        if (taskId) {
          const historicalEvents = this.getEventsByTask(taskId);
          historicalEvents.forEach((event) => {
            const message = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(message));
          });
        }

        // Cleanup on close
        return () => {
          this.unsubscribe(clientId);
        };
      },
    });
  }
}

// Singleton instance
export const eventLogger = new EventLogger();

