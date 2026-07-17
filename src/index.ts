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
export * from './agents';

// Types
export type { Event, EventHandler, EventPayload } from './core/event-bus';
export type { Phase, PhaseStatus, WorkflowDefinition, WorkflowState } from './core/workflow-engine';
export type { Project } from './core/orchestrator';

/**
 * Initialize Nova AI Studio with all agents
 */
export async function initializeNova(): Promise<void> {
  console.log('🚀 Initializing Nova AI Studio...');

  // Import and register all agents
  const {
    ProductAnalystAgent,
    ResearchAgent,
    SolutionArchitectAgent,
    UXAgent,
    UIAgent,
    CreativeDirectorAgent,
    FrontendAgent,
    BackendAgent,
    DatabaseAgent,
    SecurityAgent,
    PerformanceAgent,
    SEOAgent,
    QAAgent,
    CodeReviewerAgent,
    DocumentationAgent,
  } = await import('./agents');

  // Register all 15 agents
  orchestrator.registerAgent(new ProductAnalystAgent());
  orchestrator.registerAgent(new ResearchAgent());
  orchestrator.registerAgent(new SolutionArchitectAgent());
  orchestrator.registerAgent(new UXAgent());
  orchestrator.registerAgent(new UIAgent());
  orchestrator.registerAgent(new CreativeDirectorAgent());
  orchestrator.registerAgent(new FrontendAgent());
  orchestrator.registerAgent(new BackendAgent());
  orchestrator.registerAgent(new DatabaseAgent());
  orchestrator.registerAgent(new SecurityAgent());
  orchestrator.registerAgent(new PerformanceAgent());
  orchestrator.registerAgent(new SEOAgent());
  orchestrator.registerAgent(new QAAgent());
  orchestrator.registerAgent(new CodeReviewerAgent());
  orchestrator.registerAgent(new DocumentationAgent());

  console.log('✅ Nova AI Studio initialized');
  console.log(`   🤖 Agents: ${orchestrator.listAgents().length}`);
  console.log(`   📡 Event Types: ${Object.keys(EventTypes).length}`);
  console.log(`   ⚙️ Workflow Phases: 10`);
}

/**
 * Create a new project
 */
export async function createProject(idea: string, name?: string) {
  return orchestrator.createProject(idea, name);
}

/**
 * Execute a project through all phases
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
