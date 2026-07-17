# Workflow Engine

## Purpose
Manages project phases, state transitions, and task dependencies.

## Phases

```yaml
phases:
  - id: discovery
    name: Discovery
    agents: [product-analyst, research]
    outputs: [requirements.md, research-report.md]
    
  - id: planning
    name: Planning
    agents: [product-analyst, solution-architect]
    inputs: [requirements.md]
    outputs: [project-plan.md, task-breakdown.md]
    
  - id: architecture
    name: Architecture
    agents: [solution-architect]
    inputs: [requirements.md, project-plan.md]
    outputs: [architecture.md, tech-stack.md]
    
  - id: ux-ui
    name: UX/UI Design
    agents: [ux, ui, creative-director]
    inputs: [requirements.md, architecture.md]
    outputs: [wireframes.md, design-system.md, components.tsx]
    
  - id: development
    name: Development
    agents: [frontend, backend, database]
    inputs: [architecture.md, design-system.md]
    outputs: [source-code, database-schema.sql]
    
  - id: integration
    name: Integration
    agents: [frontend, backend]
    inputs: [source-code]
    outputs: [integrated-application]
    
  - id: security-review
    name: Security Review
    agents: [security]
    inputs: [source-code, architecture.md]
    outputs: [security-report.md]
    
  - id: qa
    name: Quality Assurance
    agents: [qa, code-reviewer]
    inputs: [integrated-application]
    outputs: [test-results.md, review-report.md]
    
  - id: deployment
    name: Deployment
    agents: [documentation]
    inputs: [integrated-application, test-results.md]
    outputs: [deployment.md, live-url]
    
  - id: improvement
    name: Continuous Improvement
    agents: [performance, seo]
    inputs: [live-url]
    outputs: [optimization-report.md]
```

## State Machine

```
pending → in-progress → review → completed
                  ↓           ↓
                failed ← ← ← 
                  ↓
              fix-required → in-progress
```
