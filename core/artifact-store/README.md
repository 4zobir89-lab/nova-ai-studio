# Artifact Store

## Purpose
Manages all project artifacts — files, documents, code, designs, and configurations.

## Artifact Types

| Type | Extension | Description |
|------|-----------|-------------|
| Document | .md | Requirements, specs, reports |
| Code | .ts, .tsx, .js, .jsx | Source code |
| Style | .css, .scss | Stylesheets |
| Data | .sql, .json | Database schemas, configs |
| Design | .figma, .sketch | Design files |
| Config | .yaml, .toml | Configuration files |
| Image | .png, .svg | Visual assets |

## Storage Structure

```
artifacts/
├── {project-id}/
│   ├── requirements/
│   │   └── requirements.md
│   ├── design/
│   │   ├── wireframes.md
│   │   └── design-system.md
│   ├── code/
│   │   ├── src/
│   │   └── package.json
│   ├── database/
│   │   └── schema.sql
│   ├── tests/
│   │   └── test-results.md
│   └── deployment/
│       └── deployment.md
```

## API

```typescript
// Save artifact
artifactStore.save(projectId, path, content, metadata)

// Retrieve artifact
artifactStore.get(projectId, path)

// List artifacts
artifactStore.list(projectId, directory?)

// Delete artifact
artifactStore.delete(projectId, path)
```
