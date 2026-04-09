import { execSync } from 'node:child_process';
import type { ProviderAdapter, ProviderHealth, ProviderSession, TaskExecutionResult } from '@swarm/provider-core';

export class CodexProvider implements ProviderAdapter {
  name = 'codex';
  supportsRemoteExecution = false;

  async healthCheck(): Promise<ProviderHealth> {
    if (process.env.CODEX_DRY_RUN === 'true') {
      return { ok: true, detail: 'dry-run mode enabled' };
    }
    try {
      execSync('codex --version', { stdio: 'ignore' });
      return { ok: true, detail: 'codex CLI detected' };
    } catch {
      return { ok: false, detail: 'codex CLI unavailable; set CODEX_DRY_RUN=true for local demo mode' };
    }
  }

  async listSessions(): Promise<ProviderSession[]> {
    return [{ id: 'local-default', label: 'Local Codex Session' }];
  }

  async acquireSession(): Promise<ProviderSession | null> {
    const health = await this.healthCheck();
    return health.ok ? { id: 'local-default', label: 'Local Codex Session' } : null;
  }

  async parseIntent(prompt: string): Promise<{ goal: string; repoHint?: string }> {
    return { goal: prompt };
  }

  async planTask(prompt: string): Promise<string[]> {
    return ['Inspect repository context', `Implement requested goal: ${prompt}`, 'Run lint/typecheck/test/build', 'Prepare draft PR summary'];
  }

  async executeTask(plan: string[]): Promise<TaskExecutionResult> {
    return {
      summary: `Executed ${plan.length} steps in ${process.env.CODEX_DRY_RUN === 'true' ? 'dry-run' : 'simulated'} mode`,
      artifacts: plan.map((step, i) => `step-${i + 1}: ${step}`)
    };
  }

  async validateTask(context: string): Promise<string> {
    return `Validation complete for: ${context}`;
  }

  async reviewTask(context: string): Promise<string> {
    return `Review complete for: ${context}`;
  }

  async summarizeTask(context: string): Promise<string> {
    return `Summary: ${context}`;
  }
}
