export type AuditActor = {
  id: string;
  type: "system" | "user" | "service";
};

export type ActionResult = "success" | "failure" | "skipped";

export type AuditArtifact = {
  id: string;
  timestamp: string;
  integration: "github" | "runners" | "notifications";
  action: string;
  actor: AuditActor;
  intent: string;
  payloadSummary: Record<string, unknown>;
  result: ActionResult;
  evidencePointers: string[];
  error?: string;
};

export interface AuditSink {
  emit(artifact: AuditArtifact): Promise<void>;
}

export class InMemoryAuditSink implements AuditSink {
  public readonly artifacts: AuditArtifact[] = [];

  async emit(artifact: AuditArtifact): Promise<void> {
    this.artifacts.push(artifact);
  }
}

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `audit-${Math.random().toString(36).slice(2)}`;

export type ExternalActionInput = {
  integration: AuditArtifact["integration"];
  action: string;
  actor: AuditActor;
  intent: string;
  payloadSummary: Record<string, unknown>;
  result: ActionResult;
  evidencePointers: string[];
  error?: string;
};

export async function emitExternalAction(
  sink: AuditSink,
  input: ExternalActionInput
): Promise<AuditArtifact> {
  const artifact: AuditArtifact = {
    id: randomId(),
    timestamp: new Date().toISOString(),
    ...input
  };
  await sink.emit(artifact);
  return artifact;
}
