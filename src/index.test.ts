/**
 * Nova AI Studio — Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { EventBus, eventBus, EventTypes } from './core/event-bus';
import { WorkflowEngine, workflowEngine, DEFAULT_WORKFLOW } from './core/workflow-engine';
import { Orchestrator, orchestrator } from './core/orchestrator';
import { ProductAnalystAgent } from './agents/definitions/product-analyst';

describe('EventBus', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should emit and receive events', async () => {
    let received = false;

    bus.on('test', () => {
      received = true;
    });

    await bus.emit('test', { data: 'hello' }, 'test');

    expect(received).toBe(true);
  });

  it('should return unsubscribe function', async () => {
    let count = 0;

    const unsubscribe = bus.on('test', () => {
      count++;
    });

    await bus.emit('test', {}, 'test');
    expect(count).toBe(1);

    unsubscribe();
    await bus.emit('test', {}, 'test');
    expect(count).toBe(1);
  });

  it('should track event history', async () => {
    await bus.emit('test1', { a: 1 }, 'source1');
    await bus.emit('test2', { b: 2 }, 'source2');

    const history = bus.getHistory();
    expect(history).toHaveLength(2);
  });
});

describe('WorkflowEngine', () => {
  it('should start a workflow', async () => {
    const state = await workflowEngine.startWorkflow('project-1');

    expect(state.status).toBe('running');
    expect(state.phases).toHaveLength(10);
    expect(state.currentPhase).toBe(0);
  });

  it('should track phase progress', async () => {
    await workflowEngine.startWorkflow('project-2');

    const phase = await workflowEngine.startPhase('project-2');
    expect(phase.status).toBe('in-progress');

    await workflowEngine.completePhase('project-2');
    expect(phase.status).toBe('completed');
  });

  it('should calculate progress percentage', async () => {
    await workflowEngine.startWorkflow('project-3');

    expect(workflowEngine.getProgress('project-3')).toBe(0);

    await workflowEngine.startPhase('project-3');
    await workflowEngine.completePhase('project-3');

    expect(workflowEngine.getProgress('project-3')).toBe(10);
  });
});

describe('Orchestrator', () => {
  it('should register agents', () => {
    const agent = new ProductAnalystAgent();
    orchestrator.registerAgent(agent);

    const agents = orchestrator.listAgents();
    expect(agents).toHaveLength(1);
    expect(agents[0].id).toBe('product-analyst');
  });

  it('should create projects', async () => {
    const project = await orchestrator.createProject('Build an e-commerce platform');

    expect(project.id).toBeDefined();
    expect(project.name).toBe('Build an e-commerce platform');
    expect(project.status).toBe('initializing');
  });

  it('should list projects', async () => {
    await orchestrator.createProject('Project A');
    await orchestrator.createProject('Project B');

    const projects = orchestrator.listProjects();
    expect(projects).toHaveLength(2);
  });
});

describe('ProductAnalystAgent', () => {
  let agent: ProductAnalystAgent;

  beforeEach(() => {
    agent = new ProductAnalystAgent();
  });

  it('should have correct config', () => {
    expect(agent.id).toBe('product-analyst');
    expect(agent.name).toBe('Product Analyst');
    expect(agent.getStatus()).toBe('idle');
  });

  it('should analyze ideas', async () => {
    const task = {
      id: 'task-1',
      title: 'analyze idea',
      description: 'Analyze project idea',
      input: { idea: 'Build a task management app' },
      priority: 'high' as const,
      status: 'pending' as const,
      createdAt: new Date(),
    };

    const result = await agent.execute(task);

    expect(result.type).toBe('idea-analysis');
    expect(result.analysis).toBeDefined();
  });

  it('should create PRDs', async () => {
    const task = {
      id: 'task-2',
      title: 'create prd',
      description: 'Create PRD',
      input: {
        analysis: {
          idea: 'Task app',
          problemStatement: 'Need better task management',
          targetUsers: ['Developers'],
          successMetrics: ['Adoption rate'],
          keyFeatures: [{ name: 'Tasks', priority: 'high', description: 'Task management' }],
          risks: [],
          assumptions: [],
        },
      },
      priority: 'high' as const,
      status: 'pending' as const,
      createdAt: new Date(),
    };

    const result = await agent.execute(task);

    expect(result.type).toBe('prd');
    expect(result.prd).toBeDefined();
  });
});
