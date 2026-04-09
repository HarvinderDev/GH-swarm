import { spawnSync } from "node:child_process";
import {
  type AcquireSessionRequest,
  type ParsedIntent,
  type ProviderAdapter,
  type ProviderHealth,
  type ProviderOutput,
  type ProviderSession,
  type ProviderRole,
  type TaskContext
} from "@codex-github-swarm/provider-core";

export interface CodexProviderOptions {
  command?: string;
  dryRun?: boolean;
  demoMode?: boolean;
  remoteExecutionEnabled?: boolean;
  timeoutMs?: number;
}

interface CommandResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}

export class CodexProvider implements ProviderAdapter {
  public readonly name = "codex";

  private readonly command: string;
  private readonly dryRun: boolean;
  private readonly demoMode: boolean;
  private readonly remoteExecutionEnabled: boolean;
  private readonly timeoutMs: number;

  constructor(options: CodexProviderOptions = {}) {
    this.command = options.command ?? "codex";
    this.dryRun = options.dryRun ?? false;
    this.demoMode = options.demoMode ?? false;
    this.remoteExecutionEnabled = options.remoteExecutionEnabled ?? false;
    this.timeoutMs = options.timeoutMs ?? 45_000;
  }

  async healthCheck(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();

    if (this.dryRun || this.demoMode) {
      return {
        ok: true,
        mode: "dry-run",
        provider: this.name,
        message: "Codex provider running in dry-run/demo mode.",
        checkedAt
      };
    }

    const result = this.runCommand(["--version"]);
    if (!result.ok) {
      return {
        ok: false,
        mode: "degraded",
        provider: this.name,
        message: "Codex CLI unavailable. Provider is in degraded mode.",
        checkedAt,
        details: {
          reason: result.error ?? (result.stderr || "unknown")
        }
      };
    }

    return {
      ok: true,
      mode: "live",
      provider: this.name,
      message: "Codex CLI available.",
      checkedAt,
      details: { version: result.stdout.trim() }
    };
  }

  async listSessions(): Promise<ProviderSession[]> {
    if (this.dryRun || this.demoMode) {
      return [this.demoSession()];
    }

    const result = this.runCommand(["sessions", "list", "--json"]);
    if (!result.ok) {
      return [];
    }

    try {
      const parsed = JSON.parse(result.stdout) as Array<{ id: string; name?: string; createdAt?: string }>;
      return parsed.map((item) => ({
        id: item.id,
        provider: this.name,
        label: item.name ?? `session-${item.id}`,
        reusable: true,
        createdAt: item.createdAt ?? new Date().toISOString(),
        metadata: { source: "codex-cli" }
      }));
    } catch {
      return [];
    }
  }

  async acquireSession(request: AcquireSessionRequest = {}): Promise<ProviderSession | null> {
    const sessions = await this.listSessions();

    if (request.preferredSessionId) {
      const preferred = sessions.find((s) => s.id === request.preferredSessionId);
      if (preferred) {
        return preferred;
      }
    }

    if (sessions.length > 0) {
      return sessions[0];
    }

    if (this.dryRun || this.demoMode) {
      return this.demoSession();
    }

    if (request.createIfMissing) {
      const result = this.runCommand(["sessions", "create", "--json"]);
      if (result.ok) {
        try {
          const parsed = JSON.parse(result.stdout) as { id: string; name?: string; createdAt?: string };
          return {
            id: parsed.id,
            provider: this.name,
            label: parsed.name ?? `session-${parsed.id}`,
            reusable: true,
            createdAt: parsed.createdAt ?? new Date().toISOString(),
            metadata: { source: "codex-cli" }
          };
        } catch {
          return null;
        }
      }
    }

    return null;
  }

  async planTask(context: TaskContext): Promise<ProviderOutput> {
    return this.runRole("planner", context, "Produce a step-by-step implementation plan.");
  }

  async executeTask(context: TaskContext): Promise<ProviderOutput> {
    return this.runRole("implementer", context, "Implement requested changes and include files touched.");
  }

  async validateTask(context: TaskContext): Promise<ProviderOutput> {
    return this.runRole("validator", context, "Validate the work and report checks/tests.");
  }

  async reviewTask(context: TaskContext): Promise<ProviderOutput> {
    return this.runRole("reviewer", context, "Review code quality, risk, and policy compliance.");
  }

  async summarizeTask(context: TaskContext): Promise<ProviderOutput> {
    return this.runRole("summarizer", context, "Summarize outcomes, open risks, and next actions.");
  }

  async parseIntent(input: string, metadata: Record<string, unknown> = {}): Promise<ParsedIntent> {
    if (this.dryRun || this.demoMode) {
      return {
        intent: "general-task",
        confidence: 0.6,
        entities: {
          tokenCount: input.trim().split(/\s+/).length,
          ...metadata
        },
        rawText: input
      };
    }

    const prompt = [
      "Parse the following user request into JSON with fields: intent, confidence, entities.",
      `Request: ${input}`,
      `Metadata: ${JSON.stringify(metadata)}`
    ].join("\n");

    const result = this.runCommand(["run", "--json", prompt]);
    if (!result.ok) {
      return {
        intent: "unknown",
        confidence: 0,
        entities: {},
        rawText: input
      };
    }

    try {
      const parsed = JSON.parse(result.stdout) as {
        intent: string;
        confidence: number;
        entities: Record<string, string | number | boolean>;
      };

      return {
        intent: parsed.intent,
        confidence: parsed.confidence,
        entities: parsed.entities,
        rawText: input
      };
    } catch {
      return {
        intent: "unknown",
        confidence: 0,
        entities: {},
        rawText: input
      };
    }
  }

  supportsRemoteExecution(): boolean {
    return this.remoteExecutionEnabled;
  }

  private async runRole(role: ProviderRole, context: TaskContext, instruction: string): Promise<ProviderOutput> {
    if (this.dryRun || this.demoMode) {
      return {
        role,
        summary: `[dry-run] ${role} completed for task ${context.taskId}.`,
        rawText: [instruction, context.instructions].join("\n")
      };
    }

    const prompt = [
      `Role: ${role}`,
      instruction,
      `Task ID: ${context.taskId}`,
      context.repo ? `Repository: ${context.repo}` : "",
      context.branch ? `Branch: ${context.branch}` : "",
      `Instructions: ${context.instructions}`,
      context.attachments?.length
        ? `Attachments: ${JSON.stringify(
            context.attachments.map((a: { name: string }) => ({ name: a.name }))
          )} `
        : ""
    ]
      .filter(Boolean)
      .join("\n");

    const result = this.runCommand(["run", prompt]);
    if (!result.ok) {
      return {
        role,
        summary: "Codex unavailable, returning degraded response.",
        rawText: result.error ?? result.stderr
      };
    }

    return {
      role,
      summary: `Completed ${role} for task ${context.taskId}.`,
      rawText: result.stdout.trim()
    };
  }

  private demoSession(): ProviderSession {
    return {
      id: "demo-session",
      provider: this.name,
      label: "Codex Demo Session",
      reusable: true,
      createdAt: new Date().toISOString(),
      metadata: { dryRun: true }
    };
  }

  private runCommand(args: string[]): CommandResult {
    const result = spawnSync(this.command, args, {
      encoding: "utf8",
      timeout: this.timeoutMs
    });

    return {
      ok: result.status === 0 && !result.error,
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? "",
      error: result.error?.message
    };
  }
}

export function createCodexProvider(options?: CodexProviderOptions): ProviderAdapter {
  return new CodexProvider(options);
}
