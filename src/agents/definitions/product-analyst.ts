/**
 * Product Analyst Agent
 * 
 * Analyzes project ideas, understands target users, and creates
 * Product Requirements Documents (PRDs).
 */

import { BaseAgent, Task } from '../base/agent';

export class ProductAnalystAgent extends BaseAgent {
  constructor() {
    super({
      id: 'product-analyst',
      name: 'Product Analyst',
      version: '1.0.0',
      description: 'Analyzes ideas, creates PRDs, and defines product requirements',
      capabilities: [
        'idea-analysis',
        'user-research',
        'prd-creation',
        'goal-definition',
        'market-analysis',
      ],
      tools: ['web-search', 'document-generator'],
    });
  }

  protected async process(task: Task): Promise<Record<string, unknown>> {
    const { title, input } = task;

    // Route based on task type
    if (title.includes('analyze') || title.includes('idea')) {
      return this.analyzeIdea(input);
    }

    if (title.includes('prd') || title.includes('requirements')) {
      return this.createPRD(input);
    }

    if (title.includes('user') || title.includes('persona')) {
      return this.createUserPersonas(input);
    }

    // Default: analyze the idea
    return this.analyzeIdea(input);
  }

  /**
   * Analyze a project idea
   */
  private async analyzeIdea(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const idea = input.idea as string;
    const context = input.context as string || '';

    // Store analysis in memory
    this.remember('current-idea', idea);

    // Generate analysis
    const analysis = {
      idea,
      problemStatement: this.extractProblem(idea),
      targetUsers: this.identifyUsers(idea),
      keyFeatures: this.suggestFeatures(idea),
      successMetrics: this.defineMetrics(idea),
      risks: this.identifyRisks(idea),
      assumptions: this.listAssumptions(idea, context),
    };

    return {
      type: 'idea-analysis',
      analysis,
      recommendations: this.generateRecommendations(analysis),
    };
  }

  /**
   * Create a Product Requirements Document
   */
  private async createPRD(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const analysis = input.analysis as Record<string, unknown>;

    const prd = {
      title: 'Product Requirements Document',
      version: '1.0.0',
      date: new Date().toISOString().split('T')[0],
      overview: {
        projectName: analysis.idea || 'Untitled Project',
        description: analysis.problemStatement || '',
       目标用户: analysis.targetUsers || [],
      },
      goals: {
        primary: analysis.successMetrics || [],
        secondary: [],
      },
      features: analysis.keyFeatures || [],
      nonFunctionalRequirements: {
        performance: 'Load time < 3s',
        scalability: 'Support 10K concurrent users',
        security: 'OWASP Top 10 compliance',
        accessibility: 'WCAG 2.1 AA',
      },
      timeline: {
        phase1: 'Discovery (1 week)',
        phase2: 'Design (2 weeks)',
        phase3: 'Development (4 weeks)',
        phase4: 'Testing (1 week)',
        phase5: 'Deployment (1 week)',
      },
      risks: analysis.risks || [],
      assumptions: analysis.assumptions || [],
    };

    return {
      type: 'prd',
      prd,
      artifacts: ['requirements.md', 'product-spec.md'],
    };
  }

  /**
   * Create user personas
   */
  private async createUserPersonas(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const users = input.users as string[] || ['primary', 'secondary', 'admin'];

    const personas = users.map((userType: string) => ({
      type: userType,
      name: this.generatePersonaName(userType),
      demographics: this.generateDemographics(userType),
      needs: this.generateNeeds(userType),
      painPoints: this.generatePainPoints(userType),
      goals: this.generateGoals(userType),
    }));

    return {
      type: 'user-personas',
      personas,
      count: personas.length,
    };
  }

  // Helper methods
  private extractProblem(idea: string): string {
    return `Solve the problem of ${idea.toLowerCase()} by providing a comprehensive solution.`;
  }

  private identifyUsers(idea: string): string[] {
    return ['Primary users', 'Secondary users', 'Administrators'];
  }

  private suggestFeatures(idea: string): Array<{ name: string; priority: string; description: string }> {
    return [
      { name: 'Core Feature', priority: 'high', description: 'Main functionality' },
      { name: 'User Management', priority: 'high', description: 'Authentication and authorization' },
      { name: 'Dashboard', priority: 'medium', description: 'Analytics and reporting' },
      { name: 'API', priority: 'medium', description: 'Integration capabilities' },
    ];
  }

  private defineMetrics(idea: string): string[] {
    return ['User adoption rate', 'Task completion rate', 'User satisfaction score'];
  }

  private identifyRisks(idea: string): Array<{ risk: string; impact: string; mitigation: string }> {
    return [
      { risk: 'Scope creep', impact: 'high', mitigation: 'Strict feature prioritization' },
      { risk: 'Technical complexity', impact: 'medium', mitigation: 'Phased approach' },
    ];
  }

  private listAssumptions(idea: string, context: string): string[] {
    return ['Target audience is tech-savvy', 'Budget allows for modern stack', 'Timeline is realistic'];
  }

  private generateRecommendations(analysis: Record<string, unknown>): string[] {
    return [
      'Start with MVP approach',
      'Focus on core features first',
      'Conduct user research early',
    ];
  }

  private generatePersonaName(type: string): string {
    const names: Record<string, string> = {
      primary: 'Alex (Primary User)',
      secondary: 'Jordan (Secondary User)',
      admin: 'Sam (Administrator)',
    };
    return names[type] || `${type} User`;
  }

  private generateDemographics(type: string): Record<string, string> {
    return {
      age: '25-45',
      occupation: 'Professional',
      techSavvy: 'Intermediate',
    };
  }

  private generateNeeds(type: string): string[] {
    return ['Efficiency', 'Reliability', 'Ease of use'];
  }

  private generatePainPoints(type: string): string[] {
    return ['Complex workflows', 'Lack of integration', 'Poor documentation'];
  }

  private generateGoals(type: string): string[] {
    return ['Complete tasks faster', 'Reduce errors', 'Improve collaboration'];
  }
}
