export type ProviderRole =
  | "planner"
  | "implementer"
  | "validator"
  | "reviewer"
  | "summarizer"
  | "intent-parser";

export interface ProviderHealth {
  ok: boolean;
  mode: "live" | "degraded" | "dry-run";
  provider: string;
  message: string;
  checkedAt: string;
  details?: Record<string, unknown>;
}

export interface ProviderSession {
  id: string;
  provider: string;
  label: string;
  reusable: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface AcquireSessionRequest {
  preferredSessionId?: string;
  createIfMissing?: boolean;
  metadata?: Record<string, unknown>;
}

export interface TaskContext {
  taskId: string;
  workspaceId?: string;
  repo?: string;
  branch?: string;
  instructions: string;
  attachments?: Array<{ name: string; content: string }>;
  metadata?: Record<string, unknown>;
}

export interface ProviderOutput {
  role: ProviderRole;
  summary: string;
  rawText: string;
  structured?: Record<string, unknown>;
  artifacts?: Array<{ path: string; description?: string }>;
}

export interface ParsedIntent {
  intent: string;
  confidence: number;
  entities: Record<string, string | number | boolean>;
  rawText: string;
}

export interface ProviderAdapter {
  readonly name: string;
  healthCheck(): Promise<ProviderHealth>;
  listSessions(): Promise<ProviderSession[]>;
  acquireSession(request?: AcquireSessionRequest): Promise<ProviderSession | null>;
  planTask(context: TaskContext): Promise<ProviderOutput>;
  executeTask(context: TaskContext): Promise<ProviderOutput>;
  validateTask(context: TaskContext): Promise<ProviderOutput>;
  reviewTask(context: TaskContext): Promise<ProviderOutput>;
  summarizeTask(context: TaskContext): Promise<ProviderOutput>;
  parseIntent(input: string, metadata?: Record<string, unknown>): Promise<ParsedIntent>;
  supportsRemoteExecution(): boolean;
}
