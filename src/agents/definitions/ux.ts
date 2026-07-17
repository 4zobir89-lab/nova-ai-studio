/**
 * UX Agent — User Experience Design
 */

import { BaseAgent, Task } from '../base/agent';

export class UXAgent extends BaseAgent {
  constructor() {
    super({
      id: 'ux',
      name: 'UX',
      version: '1.0.0',
      description: 'Designs user journeys, wireframes, and information architecture',
      capabilities: ['user-journey', 'wireframing', 'information-architecture', 'usability'],
      tools: ['wireframe-generator', 'user-flow'],
    });
  }

  protected async process(task: Task): Promise<Record<string, unknown>> {
    const input = task.input;

    return {
      type: 'ux-design',
      userJourney: this.createUserJourney(input),
      wireframes: this.createWireframes(input),
      informationArchitecture: this.createIA(input),
      usabilityGuidelines: this.createGuidelines(),
    };
  }

  private createUserJourney(input: Record<string, unknown>): Array<{ step: string; action: string; emotion: string }> {
    return [
      { step: 'Discovery', action: 'Find the product', emotion: 'Curious' },
      { step: 'Onboarding', action: 'Create account', emotion: 'Excited' },
      { step: 'First Use', action: 'Complete first task', emotion: 'Satisfied' },
      { step: 'Regular Use', action: 'Daily workflow', emotion: 'Productive' },
      { step: 'Advocacy', action: 'Recommend to others', emotion: 'Loyal' },
    ];
  }

  private createWireframes(input: Record<string, unknown>): Array<{ page: string; elements: string[] }> {
    return [
      { page: 'Home', elements: ['Hero', 'Features', 'Pricing', 'CTA'] },
      { page: 'Dashboard', elements: ['Sidebar', 'Main Content', 'Widgets'] },
      { page: 'Settings', elements: ['Form', 'Tabs', 'Save Button'] },
    ];
  }

  private createIA(input: Record<string, unknown>): Record<string, string[]> {
    return {
      'Main Navigation': ['Home', 'Dashboard', 'Projects', 'Settings'],
      'Dashboard': ['Overview', 'Analytics', 'Recent Activity'],
      'Projects': ['List', 'Create', 'Details'],
    };
  }

  private createGuidelines(): string[] {
    return [
      'Consistent navigation across all pages',
      'Clear visual hierarchy',
      'Accessible color contrast',
      'Responsive design for all screen sizes',
      'Loading states for async operations',
    ];
  }
}
