export interface ProviderSession {
  id: string;
  label: string;
}

export interface ProviderHealth {
  ok: boolean;
  detail: string;
}

export interface TaskExecutionResult {
  summary: string;
  artifacts: string[];
}

export interface ProviderAdapter {
  name: string;
  supportsRemoteExecution: boolean;
  healthCheck(): Promise<ProviderHealth>;
  listSessions(): Promise<ProviderSession[]>;
  acquireSession(preferredSessionId?: string): Promise<ProviderSession | null>;
  parseIntent(prompt: string): Promise<{ goal: string; repoHint?: string }>;
  planTask(prompt: string): Promise<string[]>;
  executeTask(plan: string[]): Promise<TaskExecutionResult>;
  validateTask(context: string): Promise<string>;
  reviewTask(context: string): Promise<string>;
  summarizeTask(context: string): Promise<string>;
}
