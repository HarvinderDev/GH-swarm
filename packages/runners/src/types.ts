import type { AuditActor, AuditSink } from "../../shared/src/audit.js";

export type RunnerKind = "local" | "remote";

export type RunnerTaskInput = {
  taskId: string;
  repoPath: string;
  command: string;
  actor: AuditActor;
  intent: string;
};

export type RunnerExecutionResult = {
  runnerKind: RunnerKind;
  exitCode: number;
  stdout: string;
  stderr: string;
  evidencePointers: string[];
};

export interface Runner {
  kind: RunnerKind;
  runTask(input: RunnerTaskInput): Promise<RunnerExecutionResult>;
}

export type RunnerRoutingPolicy = {
  preferRemote: boolean;
  remoteEligibleTaskPrefixes: string[];
};

export type RunnerDependencies = {
  auditSink: AuditSink;
  remoteEnabled: boolean;
  remoteEndpoint?: string;
  remoteToken?: string;
  dryRunDefault: boolean;
  routingPolicy: RunnerRoutingPolicy;
};
