/**
 * Nova AI Studio — Main Entry Point
 * 
 * Multi-Agent AI Software Development Platform
 */

// Core
export { EventBus, eventBus, EventTypes } from './core/event-bus';
export { WorkflowEngine, workflowEngine, DEFAULT_WORKFLOW } from './core/workflow-engine';
export { Orchestrator, orchestrator } from './core/orchestrator';

// Agents
export { BaseAgent, Task, AgentConfig, AgentStatus } from './agents/base/agent';
export { ProductAnalystAgent } from './agents/definitions/product-analyst';

// Types
export type { Event, EventHandler, EventPayload } from './core/event-bus';
export type { Phase, PhaseStatus, WorkflowDefinition, WorkflowState } from './core/workflow-engine';
export type { Project } from './core/orchestrator';

/**
 * Initialize Nova AI Studio
 */
export async function initializeNova(): Promise<void> {
  console.log('🚀 Initializing Nova AI Studio...');

  // Register default agents
  const { ProductAnalystAgent } = await import('./agents/definitions/product-analyst');
  orchestrator.registerAgent(new ProductAnalystAgent());

  console.log('✅ Nova AI Studio initialized');
  console.log(`   Agents: ${orchestrator.listAgents().length}`);
  console.log(`   Event Types: ${Object.keys(EventTypes).length}`);
}

/**
 * Create a new project
 */
export async function createProject(idea: string, name?: string) {
  return orchestrator.createProject(idea, name);
}

/**
 * Execute a project
 */
export async function executeProject(projectId: string) {
  return orchestrator.executeProject(projectId);
}

/**
 * Get system status
 */
export function getSystemStatus() {
  return {
    agents: orchestrator.listAgents(),
    projects: orchestrator.listProjects(),
    eventHistory: eventBus.getHistory().length,
  };
}
