import { exec } from "node:child_process";
import { promisify } from "node:util";
import { emitExternalAction } from "../../shared/src/audit.js";
import type { Runner, RunnerDependencies, RunnerExecutionResult, RunnerTaskInput } from "./types.js";

const execAsync = promisify(exec);

export class LocalRunner implements Runner {
  kind = "local" as const;

  constructor(private readonly deps: RunnerDependencies) {}

  async runTask(input: RunnerTaskInput): Promise<RunnerExecutionResult> {
    if (this.deps.dryRunDefault) {
      const dryRunResult: RunnerExecutionResult = {
        runnerKind: "local",
        exitCode: 0,
        stdout: `[dry-run] ${input.command}`,
        stderr: "",
        evidencePointers: [`mock://runner/local/${input.taskId}`]
      };
      await emitExternalAction(this.deps.auditSink, {
        integration: "runners",
        action: "execute_local_task",
        actor: input.actor,
        intent: input.intent,
        payloadSummary: { taskId: input.taskId, repoPath: input.repoPath, command: input.command, mode: "dry-run" },
        result: "success",
        evidencePointers: dryRunResult.evidencePointers
      });
      return dryRunResult;
    }

    try {
      const output = await execAsync(input.command, { cwd: input.repoPath });
      const result: RunnerExecutionResult = {
        runnerKind: "local",
        exitCode: 0,
        stdout: output.stdout,
        stderr: output.stderr,
        evidencePointers: [`file://logs/runners/local/${input.taskId}.log`]
      };
      await emitExternalAction(this.deps.auditSink, {
        integration: "runners",
        action: "execute_local_task",
        actor: input.actor,
        intent: input.intent,
        payloadSummary: { taskId: input.taskId, repoPath: input.repoPath, command: input.command, mode: "live" },
        result: "success",
        evidencePointers: result.evidencePointers
      });
      return result;
    } catch (error) {
      await emitExternalAction(this.deps.auditSink, {
        integration: "runners",
        action: "execute_local_task",
        actor: input.actor,
        intent: input.intent,
        payloadSummary: { taskId: input.taskId, repoPath: input.repoPath, command: input.command, mode: "live" },
        result: "failure",
        evidencePointers: [],
        error: String(error)
      });
      throw error;
    }
  }
}
