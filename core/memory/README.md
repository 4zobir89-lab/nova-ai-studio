# Memory System

## Architecture

Nova AI Studio uses a three-layer memory system:

### 1. Project Memory
Stores all project-related data:
- Source code
- Design files
- Documentation
- Decisions
- Configuration

### 2. Agent Memory
Each agent maintains its own memory:
- Task history
- Learnings
- Patterns discovered
- Best practices

### 3. Knowledge Memory
Shared knowledge base:
- Best practices
- Common patterns
- Documentation
- Templates

## Storage

```
memory/
├── projects/
│   └── {project-id}/
│       ├── artifacts/
│       ├── decisions/
│       ├── code/
│       └── metadata.json
├── agents/
│   └── {agent-id}/
│       ├── history/
│       ├── learnings/
│       └── patterns/
└── knowledge/
    ├── best-practices/
    ├── patterns/
    └── templates/
```

## API

```typescript
// Project Memory
memory.project.get(projectId)
memory.project.save(projectId, artifact)
memory.project.list(projectId)

// Agent Memory
memory.agent.get(agentId)
memory.agent.save(agentId, learning)
memory.agent.history(agentId)

// Knowledge Memory
memory.knowledge.search(query)
memory.knowledge.save(category, item)
memory.knowledge.list(category)
```
