/**
 * Agents — Export all agent implementations
 */

export { BaseAgent, Task, AgentConfig, AgentStatus } from './base/agent';

// All agent implementations
export { ProductAnalystAgent } from './definitions/product-analyst';
export { ResearchAgent } from './definitions/research';
export { SolutionArchitectAgent } from './definitions/solution-architect';
export { UXAgent } from './definitions/ux';
export { UIAgent } from './definitions/ui';
export { CreativeDirectorAgent } from './definitions/creative-director';
export { FrontendAgent } from './definitions/frontend';
export { BackendAgent } from './definitions/backend';
export { DatabaseAgent } from './definitions/database';
export { SecurityAgent } from './definitions/security';
export { PerformanceAgent } from './definitions/performance';
export { SEOAgent } from './definitions/seo';
export { QAAgent } from './definitions/qa';
export { CodeReviewerAgent } from './definitions/code-reviewer';
export { DocumentationAgent } from './definitions/documentation';

/**
 * Create all agents
 */
export function createAllAgents() {
  return {
    productAnalyst: new ProductAnalystAgent(),
    research: new ResearchAgent(),
    solutionArchitect: new SolutionArchitectAgent(),
    ux: new UXAgent(),
    ui: new UIAgent(),
    creativeDirector: new CreativeDirectorAgent(),
    frontend: new FrontendAgent(),
    backend: new BackendAgent(),
    database: new DatabaseAgent(),
    security: new SecurityAgent(),
    performance: new PerformanceAgent(),
    seo: new SEOAgent(),
    qa: new QAAgent(),
    codeReviewer: new CodeReviewerAgent(),
    documentation: new DocumentationAgent(),
  };
}
