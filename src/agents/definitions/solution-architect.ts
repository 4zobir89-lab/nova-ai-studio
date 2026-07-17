/**
 * Solution Architect Agent — Technical Design & Stack Selection
 */

import { BaseAgent, Task } from '../base/agent';

export class SolutionArchitectAgent extends BaseAgent {
  constructor() {
    super({
      id: 'solution-architect',
      name: 'Solution Architect',
      version: '1.0.0',
      description: 'Designs technical architecture, selects tech stack, defines system components',
      capabilities: ['architecture-design', 'tech-selection', 'system-design', 'api-design'],
      tools: ['diagram-generator', 'documentation'],
    });
  }

  protected async process(task: Task): Promise<Record<string, unknown>> {
    const input = task.input;

    if (task.title.includes('architecture')) {
      return this.designArchitecture(input);
    }

    return this.designArchitecture(input);
  }

  private designArchitecture(input: Record<string, unknown>): Record<string, unknown> {
    const architecture = {
      pattern: 'Microservices',
      frontend: { framework: 'Next.js 14', language: 'TypeScript', styling: 'Tailwind CSS' },
      backend: { framework: 'Node.js + Express', language: 'TypeScript', orm: 'Prisma' },
      database: { primary: 'PostgreSQL', cache: 'Redis', search: 'Elasticsearch' },
      infrastructure: { cloud: 'AWS', ci_cd: 'GitHub Actions', containerization: 'Docker' },
      components: [
        { name: 'API Gateway', responsibility: 'Route requests, rate limiting' },
        { name: 'Auth Service', responsibility: 'Authentication & authorization' },
        { name: 'Core Service', responsibility: 'Business logic' },
        { name: 'Notification Service', responsibility: 'Email, push, in-app' },
      ],
      security: ['JWT tokens', 'HTTPS everywhere', 'Input validation', 'Rate limiting'],
      scalability: ['Horizontal scaling', 'CDN', 'Database replication', 'Load balancing'],
    };

    return {
      type: 'architecture',
      architecture,
      techStack: this.extractTechStack(architecture),
      diagrams: ['system-overview', 'data-flow', 'deployment'],
    };
  }

  private extractTechStack(arch: Record<string, unknown>): string[] {
    const stack: string[] = [];
    const frontend = arch.frontend as Record<string, string>;
    const backend = arch.backend as Record<string, string>;
    const database = arch.database as Record<string, string>;

    stack.push(frontend.framework, frontend.language, backend.framework, database.primary, database.cache);
    return stack;
  }
}
