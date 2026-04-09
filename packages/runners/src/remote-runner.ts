import { emitExternalAction } from "../../shared/src/audit.js";
import type { Runner, RunnerDependencies, RunnerExecutionResult, RunnerTaskInput } from "./types.js";

export class RemoteRunner implements Runner {
  kind = "remote" as const;

  constructor(private readonly deps: RunnerDependencies) {}

  async runTask(input: RunnerTaskInput): Promise<RunnerExecutionResult> {
    if (!this.deps.remoteEnabled || !this.deps.remoteEndpoint) {
      const error = "Remote runner is not configured";
      await emitExternalAction(this.deps.auditSink, {
        integration: "runners",
        action: "execute_remote_task",
        actor: input.actor,
        intent: input.intent,
        payloadSummary: { taskId: input.taskId, endpoint: this.deps.remoteEndpoint ?? null, mode: "disabled" },
        result: "skipped",
        evidencePointers: [],
        error
      });
      throw new Error(error);
    }

    if (this.deps.dryRunDefault) {
      const dryRunResult: RunnerExecutionResult = {
        runnerKind: "remote",
        exitCode: 0,
        stdout: `[dry-run] remote execution accepted for ${input.taskId}`,
        stderr: "",
        evidencePointers: [`mock://runner/remote/${input.taskId}`]
      };
      await emitExternalAction(this.deps.auditSink, {
        integration: "runners",
        action: "execute_remote_task",
        actor: input.actor,
        intent: input.intent,
        payloadSummary: { taskId: input.taskId, endpoint: this.deps.remoteEndpoint, command: input.command, mode: "dry-run" },
        result: "success",
        evidencePointers: dryRunResult.evidencePointers
      });
      return dryRunResult;
    }

    try {
      const response = await fetch(`${this.deps.remoteEndpoint}/execute`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(this.deps.remoteToken ? { authorization: `Bearer ${this.deps.remoteToken}` } : {})
        },
        body: JSON.stringify({
          taskId: input.taskId,
          repoPath: input.repoPath,
          command: input.command
        })
      });

      if (!response.ok) {
        throw new Error(`Remote runner returned ${response.status}`);
      }

      const payload = (await response.json()) as {
        exitCode: number;
        stdout?: string;
        stderr?: string;
        evidencePointers?: string[];
      };

      const result: RunnerExecutionResult = {
        runnerKind: "remote",
        exitCode: payload.exitCode,
        stdout: payload.stdout ?? "",
        stderr: payload.stderr ?? "",
        evidencePointers: payload.evidencePointers ?? []
      };

      await emitExternalAction(this.deps.auditSink, {
        integration: "runners",
        action: "execute_remote_task",
        actor: input.actor,
        intent: input.intent,
        payloadSummary: { taskId: input.taskId, endpoint: this.deps.remoteEndpoint, command: input.command, mode: "live" },
        result: "success",
        evidencePointers: result.evidencePointers
      });
      return result;
    } catch (error) {
      await emitExternalAction(this.deps.auditSink, {
        integration: "runners",
        action: "execute_remote_task",
        actor: input.actor,
        intent: input.intent,
        payloadSummary: { taskId: input.taskId, endpoint: this.deps.remoteEndpoint, command: input.command, mode: "live" },
        result: "failure",
        evidencePointers: [],
        error: String(error)
      });
      throw error;
    }
  }
}
