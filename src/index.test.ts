/**
 * Nova AI Studio — Complete Test Suite
 */

import { describe, it, expect } from 'vitest';
import {
  EventBus, eventBus, EventTypes,
  WorkflowEngine, workflowEngine, DEFAULT_WORKFLOW,
  Orchestrator, orchestrator,
  createAllAgents,
} from './index';

describe('EventBus', () => {
  it('should emit and receive events', async () => {
    const bus = new EventBus();
    let received = false;

    bus.on('test', () => { received = true; });
    await bus.emit('test', { data: 'hello' }, 'test');

    expect(received).toBe(true);
  });

  it('should track history', async () => {
    const bus = new EventBus();
    await bus.emit('e1', {}, 's');
    await bus.emit('e2', {}, 's');

    expect(bus.getHistory()).toHaveLength(2);
  });
});

describe('WorkflowEngine', () => {
  it('should have 10 phases', () => {
    expect(DEFAULT_WORKFLOW.phases).toHaveLength(10);
  });

  it('should start workflow', async () => {
    const state = await workflowEngine.startWorkflow('p1');
    expect(state.status).toBe('running');
    expect(state.phases).toHaveLength(10);
  });

  it('should complete phase', async () => {
    await workflowEngine.startWorkflow('p2');
    await workflowEngine.startPhase('p2');
    const phase = await workflowEngine.completePhase('p2');
    expect(phase.status).toBe('completed');
  });
});

describe('All 15 Agents', () => {
  const agents = createAllAgents();

  it('should create all 15 agents', () => {
    expect(Object.keys(agents)).toHaveLength(15);
  });

  it('each agent should have unique ID', () => {
    const ids = Object.values(agents).map(a => a.id);
    expect(new Set(ids).size).toBe(15);
  });

  it('each agent should have capabilities', () => {
    Object.values(agents).forEach(agent => {
      expect(agent.getInfo().capabilities.length).toBeGreaterThan(0);
    });
  });

  it('each agent should have tools', () => {
    Object.values(agents).forEach(agent => {
      expect(agent.getInfo().tools.length).toBeGreaterThan(0);
    });
  });

  it('all agents should be idle initially', () => {
    Object.values(agents).forEach(agent => {
      expect(agent.getStatus()).toBe('idle');
    });
  });
});

describe('Orchestrator', () => {
  it('should register all 15 agents', () => {
    const testOrchestrator = new Orchestrator();
    const agents = createAllAgents();

    Object.values(agents).forEach(agent => {
      testOrchestrator.registerAgent(agent);
    });

    expect(testOrchestrator.listAgents()).toHaveLength(15);
  });

  it('should create project', async () => {
    const project = await orchestrator.createProject('Build an AI platform');
    expect(project.id).toBeDefined();
    expect(project.status).toBe('initializing');
  });
});

describe('Agent Execution', () => {
  it('ProductAnalyst should analyze ideas', async () => {
    const agents = createAllAgents();
    const result = await agents.productAnalyst.execute({
      id: 't1',
      title: 'analyze idea',
      description: 'Analyze',
      input: { idea: 'Build a task app' },
      priority: 'high',
      status: 'pending',
      createdAt: new Date(),
    });

    expect(result.type).toBe('idea-analysis');
  });

  it('Security should generate report', async () => {
    const agents = createAllAgents();
    const result = await agents.security.execute({
      id: 't2',
      title: 'security audit',
      description: 'Audit',
      input: {},
      priority: 'high',
      status: 'pending',
      createdAt: new Date(),
    });

    expect(result.type).toBe('security-report');
  });

  it('QA should create test plan', async () => {
    const agents = createAllAgents();
    const result = await agents.qa.execute({
      id: 't3',
      title: 'create tests',
      description: 'Test',
      input: {},
      priority: 'high',
      status: 'pending',
      createdAt: new Date(),
    });

    expect(result.type).toBe('test-results');
  });
});
