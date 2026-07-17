/**
 * Workflow Engine — Phase Management & State Transitions
 * 
 * Manages the 10-phase development workflow with state machine logic.
 */

import { eventBus, EventTypes } from '../event-bus';

export type PhaseStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';

export interface Phase {
  id: string;
  name: string;
  description: string;
  agents: string[];
  inputs: string[];
  outputs: string[];
  status: PhaseStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  phases: Omit<Phase, 'status'>[];
}

export interface WorkflowState {
  workflowId: string;
  projectId: string;
  currentPhase: number;
  phases: Phase[];
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'paused';
}

// Default 10-Phase Workflow
export const DEFAULT_WORKFLOW: WorkflowDefinition = {
  id: 'nova-default',
  name: 'Nova AI Studio Default Workflow',
  phases: [
    {
      id: 'discovery',
      name: 'Discovery',
      description: 'Understand the idea and gather requirements',
      agents: ['product-analyst', 'research'],
      inputs: ['project-idea'],
      outputs: ['requirements.md', 'research-report.md'],
    },
    {
      id: 'planning',
      name: 'Planning',
      description: 'Create project plan and task breakdown',
      agents: ['product-analyst', 'solution-architect'],
      inputs: ['requirements.md'],
      outputs: ['project-plan.md', 'task-breakdown.md'],
    },
    {
      id: 'architecture',
      name: 'Architecture',
      description: 'Design technical architecture',
      agents: ['solution-architect'],
      inputs: ['requirements.md', 'project-plan.md'],
      outputs: ['architecture.md', 'tech-stack.md'],
    },
    {
      id: 'ux-ui',
      name: 'UX/UI Design',
      description: 'Create user experience and visual design',
      agents: ['ux', 'ui', 'creative-director'],
      inputs: ['requirements.md', 'architecture.md'],
      outputs: ['wireframes.md', 'design-system.md'],
    },
    {
      id: 'development',
      name: 'Development',
      description: 'Build the application',
      agents: ['frontend', 'backend', 'database'],
      inputs: ['architecture.md', 'design-system.md'],
      outputs: ['source-code', 'database-schema.sql'],
    },
    {
      id: 'integration',
      name: 'Integration',
      description: 'Integrate all components',
      agents: ['frontend', 'backend'],
      inputs: ['source-code'],
      outputs: ['integrated-application'],
    },
    {
      id: 'security-review',
      name: 'Security Review',
      description: 'Audit security and fix vulnerabilities',
      agents: ['security'],
      inputs: ['source-code', 'architecture.md'],
      outputs: ['security-report.md'],
    },
    {
      id: 'qa',
      name: 'Quality Assurance',
      description: 'Test and validate the application',
      agents: ['qa', 'code-reviewer'],
      inputs: ['integrated-application'],
      outputs: ['test-results.md', 'review-report.md'],
    },
    {
      id: 'deployment',
      name: 'Deployment',
      description: 'Deploy to production',
      agents: ['documentation'],
      inputs: ['integrated-application', 'test-results.md'],
      outputs: ['deployment.md', 'live-url'],
    },
    {
      id: 'improvement',
      name: 'Continuous Improvement',
      description: 'Optimize and monitor',
      agents: ['performance', 'seo'],
      inputs: ['live-url'],
      outputs: ['optimization-report.md'],
    },
  ],
};

export class WorkflowEngine {
  private states: Map<string, WorkflowState> = new Map();

  /**
   * Start a new workflow for a project
   */
  async startWorkflow(projectId: string, definition: WorkflowDefinition = DEFAULT_WORKFLOW): Promise<WorkflowState> {
    const phases: Phase[] = definition.phases.map((phase) => ({
      ...phase,
      status: 'pending' as PhaseStatus,
    }));

    const state: WorkflowState = {
      workflowId: definition.id,
      projectId,
      currentPhase: 0,
      phases,
      startedAt: new Date(),
      status: 'running',
    };

    this.states.set(projectId, state);

    await eventBus.emit(EventTypes.PROJECT_CREATED, { projectId, workflow: definition.id }, 'workflow-engine');

    return state;
  }

  /**
   * Get current workflow state
   */
  getState(projectId: string): WorkflowState | undefined {
    return this.states.get(projectId);
  }

  /**
   * Start the current phase
   */
  async startPhase(projectId: string): Promise<Phase> {
    const state = this.states.get(projectId);
    if (!state) throw new Error(`No workflow found for project: ${projectId}`);

    const phase = state.phases[state.currentPhase];
    if (!phase) throw new Error('No more phases to execute');

    if (phase.status !== 'pending') {
      throw new Error(`Phase ${phase.id} is not pending (status: ${phase.status})`);
    }

    phase.status = 'in-progress';
    phase.startedAt = new Date();

    await eventBus.emit(
      EventTypes.PHASE_STARTED,
      { phaseId: phase.id, phaseName: phase.name },
      'workflow-engine',
      { projectId }
    );

    return phase;
  }

  /**
   * Complete the current phase
   */
  async completePhase(projectId: string): Promise<Phase> {
    const state = this.states.get(projectId);
    if (!state) throw new Error(`No workflow found for project: ${projectId}`);

    const phase = state.phases[state.currentPhase];
    if (!phase) throw new Error('No current phase');

    if (phase.status !== 'in-progress') {
      throw new Error(`Phase ${phase.id} is not in-progress (status: ${phase.status})`);
    }

    phase.status = 'completed';
    phase.completedAt = new Date();

    await eventBus.emit(
      EventTypes.PHASE_COMPLETED,
      { phaseId: phase.id, phaseName: phase.name, outputs: phase.outputs },
      'workflow-engine',
      { projectId }
    );

    // Move to next phase
    state.currentPhase++;

    // Check if workflow is complete
    if (state.currentPhase >= state.phases.length) {
      state.status = 'completed';
      state.completedAt = new Date();
      await eventBus.emit(EventTypes.PROJECT_COMPLETED, { projectId }, 'workflow-engine');
    }

    return phase;
  }

  /**
   * Fail the current phase
   */
  async failPhase(projectId: string, error: string): Promise<Phase> {
    const state = this.states.get(projectId);
    if (!state) throw new Error(`No workflow found for project: ${projectId}`);

    const phase = state.phases[state.currentPhase];
    if (!phase) throw new Error('No current phase');

    phase.status = 'failed';
    phase.error = error;

    state.status = 'failed';

    await eventBus.emit(
      EventTypes.PHASE_FAILED,
      { phaseId: phase.id, error },
      'workflow-engine',
      { projectId }
    );

    return phase;
  }

  /**
   * Get list of all projects
   */
  listProjects(): string[] {
    return Array.from(this.states.keys());
  }

  /**
   * Get workflow progress percentage
   */
  getProgress(projectId: string): number {
    const state = this.states.get(projectId);
    if (!state) return 0;

    const completed = state.phases.filter((p) => p.status === 'completed').length;
    return Math.round((completed / state.phases.length) * 100);
  }
}

export const workflowEngine = new WorkflowEngine();
