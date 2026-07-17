/**
 * Master Orchestrator — The Brain of Nova AI Studio
 * 
 * Coordinates all agents, manages workflows, and makes decisions.
 */

import { eventBus, EventTypes } from '../event-bus';
import { workflowEngine, WorkflowState } from '../workflow-engine';
import { BaseAgent, Task } from '../../agents/base/agent';

export interface Project {
  id: string;
  name: string;
  idea: string;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  workflow: WorkflowState;
  tasks: Task[];
  artifacts: Map<string, unknown>;
  createdAt: Date;
  completedAt?: Date;
}

export class Orchestrator {
  private agents: Map<string, BaseAgent> = new Map();
  private projects: Map<string, Project> = new Map();

  /**
   * Register an agent
   */
  registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.id, agent);
    eventBus.emit(EventTypes.AGENT_REGISTERED, { agentId: agent.id, name: agent.name }, 'orchestrator');
  }

  /**
   * Get an agent by ID
   */
  getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * List all registered agents
   */
  listAgents(): Array<{ id: string; name: string; status: string }> {
    return Array.from(this.agents.values()).map((agent) => ({
      id: agent.id,
      name: agent.name,
      status: agent.getStatus(),
    }));
  }

  /**
   * Create a new project
   */
  async createProject(idea: string, name?: string): Promise<Project> {
    const projectId = crypto.randomUUID();
    const projectName = name || this.extractProjectName(idea);

    // Start workflow
    const workflow = await workflowEngine.startWorkflow(projectId);

    const project: Project = {
      id: projectId,
      name: projectName,
      idea,
      status: 'initializing',
      workflow,
      tasks: [],
      artifacts: new Map(),
      createdAt: new Date(),
    };

    this.projects.set(projectId, project);

    // Store idea as initial artifact
    project.artifacts.set('project-idea', { idea, name: projectName });

    return project;
  }

  /**
   * Execute a project through all phases
   */
  async executeProject(projectId: string): Promise<Project> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);

    project.status = 'running';

    try {
      // Execute each phase
      for (let i = 0; i < project.workflow.phases.length; i++) {
        const phase = await workflowEngine.startPhase(projectId);

        console.log(`\n🔄 Phase ${i + 1}: ${phase.name}`);
        console.log(`   Agents: ${phase.agents.join(', ')}`);

        // Execute phase tasks
        await this.executePhase(project, phase);

        // Complete phase
        await workflowEngine.completePhase(projectId);

        console.log(`✅ Phase ${i + 1} completed: ${phase.name}`);
      }

      project.status = 'completed';
      project.completedAt = new Date();

      return project;
    } catch (error) {
      project.status = 'failed';
      await workflowEngine.failPhase(projectId, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Execute a single phase
   */
  private async executePhase(project: Project, phase: { id: string; agents: string[]; inputs: string[]; outputs: string[] }): Promise<void> {
    // Create tasks for each agent in the phase
    for (const agentId of phase.agents) {
      const agent = this.agents.get(agentId);
      if (!agent) {
        console.log(`   ⚠️ Agent not found: ${agentId}, skipping`);
        continue;
      }

      // Gather inputs from artifacts
      const input: Record<string, unknown> = {};
      for (const inputKey of phase.inputs) {
        const artifact = project.artifacts.get(inputKey);
        if (artifact) {
          input[inputKey] = artifact;
        }
      }

      // Add project idea to first phase
      if (phase.id === 'discovery') {
        input.idea = project.idea;
      }

      // Create task
      const task: Task = {
        id: crypto.randomUUID(),
        title: `${phase.id}-${agentId}`,
        description: `Execute ${phase.id} phase using ${agentId}`,
        input,
        priority: 'high',
        status: 'pending',
        createdAt: new Date(),
      };

      project.tasks.push(task);

      // Execute task
      try {
        const output = await agent.execute(task);

        // Store outputs as artifacts
        for (const outputKey of phase.outputs) {
          if (output[outputKey] !== undefined) {
            project.artifacts.set(outputKey, output[outputKey]);
          }
        }

        // Also store the full output
        project.artifacts.set(`${phase.id}-${agentId}-output`, output);
      } catch (error) {
        console.log(`   ❌ Agent ${agentId} failed: ${error}`);
      }
    }
  }

  /**
   * Get project by ID
   */
  getProject(projectId: string): Project | undefined {
    return this.projects.get(projectId);
  }

  /**
   * List all projects
   */
  listProjects(): Array<{ id: string; name: string; status: string; progress: number }> {
    return Array.from(this.projects.values()).map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      progress: workflowEngine.getProgress(project.id),
    }));
  }

  /**
   * Get project artifacts
   */
  getArtifacts(projectId: string): Map<string, unknown> | undefined {
    return this.projects.get(projectId)?.artifacts;
  }

  /**
   * Extract project name from idea
   */
  private extractProjectName(idea: string): string {
    // Simple extraction: take first few words
    const words = idea.split(' ').slice(0, 5).join(' ');
    return words.length > 50 ? words.substring(0, 50) + '...' : words;
  }
}

export const orchestrator = new Orchestrator();
