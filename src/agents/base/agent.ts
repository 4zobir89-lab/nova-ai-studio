/**
 * Base Agent — Abstract class for all Nova AI Studio agents
 * 
 * Provides common functionality for agent lifecycle, task execution,
 * and communication with the orchestrator.
 */

import { eventBus, EventTypes } from '../../core/event-bus';

export type AgentStatus = 'idle' | 'busy' | 'error' | 'offline';

export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  tools: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  input: Record<string, unknown>;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  output?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected status: AgentStatus = 'idle';
  protected currentTask: Task | null = null;
  protected memory: Map<string, unknown> = new Map();

  constructor(config: AgentConfig) {
    this.config = config;
  }

  /**
   * Get agent ID
   */
  get id(): string {
    return this.config.id;
  }

  /**
   * Get agent name
   */
  get name(): string {
    return this.config.name;
  }

  /**
   * Get agent status
   */
  getStatus(): AgentStatus {
    return this.status;
  }

  /**
   * Execute a task
   */
  async execute(task: Task): Promise<Record<string, unknown>> {
    if (this.status === 'busy') {
      throw new Error(`Agent ${this.id} is busy with task ${this.currentTask?.id}`);
    }

    this.status = 'busy';
    this.currentTask = task;
    task.status = 'in-progress';
    task.startedAt = new Date();

    await eventBus.emit(
      EventTypes.TASK_STARTED,
      { taskId: task.id, agentId: this.id },
      this.id,
      { agentId: this.id, taskId: task.id }
    );

    try {
      // Call the abstract process method
      const output = await this.process(task);

      task.status = 'completed';
      task.output = output;
      task.completedAt = new Date();
      this.status = 'idle';
      this.currentTask = null;

      await eventBus.emit(
        EventTypes.TASK_COMPLETED,
        { taskId: task.id, agentId: this.id, output },
        this.id,
        { agentId: this.id, taskId: task.id }
      );

      return output;
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : String(error);
      this.status = 'error';
      this.currentTask = null;

      await eventBus.emit(
        EventTypes.TASK_FAILED,
        { taskId: task.id, agentId: this.id, error: task.error },
        this.id,
        { agentId: this.id, taskId: task.id }
      );

      throw error;
    }
  }

  /**
   * Process a task — must be implemented by subclasses
   */
  protected abstract process(task: Task): Promise<Record<string, unknown>>;

  /**
   * Store data in agent memory
   */
  protected remember(key: string, value: unknown): void {
    this.memory.set(key, value);
  }

  /**
   * Recall data from agent memory
   */
  protected recall(key: string): unknown {
    return this.memory.get(key);
  }

  /**
   * Check if agent has a capability
   */
  hasCapability(capability: string): boolean {
    return this.config.capabilities.includes(capability);
  }

  /**
   * Check if agent can use a tool
   */
  canUseTool(tool: string): boolean {
    return this.config.tools.includes(tool);
  }

  /**
   * Get agent info
   */
  getInfo(): AgentConfig & { status: AgentStatus } {
    return {
      ...this.config,
      status: this.status,
    };
  }
}
