# Master Orchestrator

## Purpose
The Orchestrator is the central brain of Nova AI Studio. It manages the entire project lifecycle.

## Responsibilities

### 1. Understanding
- Parse user input
- Extract intent and requirements
- Identify project type and scope

### 2. Planning
- Decompose into phases
- Create task dependencies
- Assign agents to tasks
- Set priorities

### 3. Execution
- Dispatch tasks to agents
- Monitor progress
- Handle failures
- Coordinate parallel work

### 4. Decision Making
- Resolve conflicts
- Approve artifacts
- Escalate issues
- Make trade-offs

### 5. Quality Control
- Review agent outputs
- Ensure consistency
- Validate completeness
- Maintain standards

## Communication Protocol

```json
{
  "id": "task-uuid",
  "title": "Task description",
  "owner": "agent-id",
  "priority": "high|medium|low",
  "input": "Input data or references",
  "output": "Expected output format",
  "status": "pending|in-progress|review|completed|failed",
  "reviewer": "agent-id or null",
  "dependencies": ["task-uuid-1", "task-uuid-2"]
}
```

## Event System

| Event | Description |
|-------|-------------|
| PROJECT_CREATED | New project initialized |
| REQUIREMENTS_READY | PRD complete |
| DESIGN_READY | UX/UI complete |
| CODE_READY | Development complete |
| TEST_FAILED | QA found issues |
| FIX_REQUIRED | Rework needed |
| DEPLOY_READY | Ready for deployment |
| PROJECT_COMPLETED | Project delivered |
