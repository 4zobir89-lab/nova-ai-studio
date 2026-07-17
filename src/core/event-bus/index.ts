/**
 * Event Bus — Event-Driven Architecture for Nova AI Studio
 * 
 * Central event system that allows agents and components to communicate
 * asynchronously through events.
 */

export type EventPayload = Record<string, unknown>;

export interface Event {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  payload: EventPayload;
  metadata?: {
    projectId?: string;
    taskId?: string;
    agentId?: string;
  };
}

export type EventHandler = (event: Event) => Promise<void> | void;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private history: Event[] = [];

  /**
   * Subscribe to an event type
   */
  on(eventType: string, handler: EventHandler): () => void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);

    // Return unsubscribe function
    return () => {
      const current = this.handlers.get(eventType) || [];
      this.handlers.set(
        eventType,
        current.filter((h) => h !== handler)
      );
    };
  }

  /**
   * Emit an event
   */
  async emit(eventType: string, payload: EventPayload, source: string, metadata?: Event['metadata']): Promise<void> {
    const event: Event = {
      id: crypto.randomUUID(),
      type: eventType,
      timestamp: new Date(),
      source,
      payload,
      metadata,
    };

    this.history.push(event);

    const handlers = this.handlers.get(eventType) || [];
    const allHandlers = this.handlers.get('*') || [];

    // Execute all handlers in parallel
    await Promise.allSettled([
      ...handlers.map((h) => h(event)),
      ...allHandlers.map((h) => h(event)),
    ]);
  }

  /**
   * Wait for a specific event
   */
  waitFor(eventType: string, timeoutMs: number = 30000): Promise<Event> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        unsubscribe();
        reject(new Error(`Timeout waiting for event: ${eventType}`));
      }, timeoutMs);

      const unsubscribe = this.on(eventType, (event) => {
        clearTimeout(timeout);
        unsubscribe();
        resolve(event);
      });
    });
  }

  /**
   * Get event history
   */
  getHistory(filter?: { type?: string; source?: string }): Event[] {
    if (!filter) return [...this.history];

    return this.history.filter((event) => {
      if (filter.type && event.type !== filter.type) return false;
      if (filter.source && event.source !== filter.source) return false;
      return true;
    });
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
  }
}

// Event Types
export const EventTypes = {
  // Project lifecycle
  PROJECT_CREATED: 'PROJECT_CREATED',
  PROJECT_COMPLETED: 'PROJECT_COMPLETED',
  PROJECT_FAILED: 'PROJECT_FAILED',

  // Phase events
  PHASE_STARTED: 'PHASE_STARTED',
  PHASE_COMPLETED: 'PHASE_COMPLETED',
  PHASE_FAILED: 'PHASE_FAILED',

  // Task events
  TASK_CREATED: 'TASK_CREATED',
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_STARTED: 'TASK_STARTED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_FAILED: 'TASK_FAILED',
  TASK_REVIEW_REQUIRED: 'TASK_REVIEW_REQUIRED',

  // Agent events
  AGENT_REGISTERED: 'AGENT_REGISTERED',
  AGENT_UNREGISTERED: 'AGENT_UNREGISTERED',
  AGENT_ERROR: 'AGENT_ERROR',

  // Artifact events
  ARTIFACT_CREATED: 'ARTIFACT_CREATED',
  ARTIFACT_UPDATED: 'ARTIFACT_UPDATED',
  ARTIFACT_DELETED: 'ARTIFACT_DELETED',

  // System events
  SYSTEM_READY: 'SYSTEM_READY',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  SYSTEM_SHUTDOWN: 'SYSTEM_SHUTDOWN',
} as const;

export const eventBus = new EventBus();
