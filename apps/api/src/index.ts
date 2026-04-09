import Fastify from "fastify";
import {
  ApprovalRequestSchema,
  AuditRecordSchema,
  ProviderSessionSchema,
  RepoSchema,
  TaskIntentSchema,
  guardTransition
} from "@codex-swarm/domain";
import { orchestrateIntent, publishRun } from "./orchestrator.js";
import { appendAuditRecord, createStore, persistApprovals, readAuditLog } from "./store.js";

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const app = Fastify({ logger: true });
const store = createStore();

app.get("/health", async () => ({ ok: true }));

app.post("/repos", async (request, reply) => {
  const payload = RepoSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(request.body);
  const repo = RepoSchema.parse({
    ...payload,
    id: id("repo"),
    createdAt: now(),
    updatedAt: now()
  });

  store.repos.set(repo.id, repo);
  return reply.code(201).send(repo);
});

app.get("/repos", async () => Array.from(store.repos.values()));

app.post("/providers/sessions", async (request, reply) => {
  const payload = ProviderSessionSchema.omit({ id: true, createdAt: true, lastCheckedAt: true }).parse(request.body);
  const session = ProviderSessionSchema.parse({
    ...payload,
    id: id("provider"),
    createdAt: now(),
    lastCheckedAt: now()
  });

  store.providerSessions.set(session.id, session);

  appendAuditRecord(
    AuditRecordSchema.parse({
      id: id("audit"),
      occurredAt: now(),
      actor: { type: "system", id: "api" },
      action: "external.provider.call",
      targetType: "provider_session",
      targetId: session.id,
      metadata: { operation: "register-session" }
    })
  );

  return reply.code(201).send(session);
});

app.get("/providers/sessions", async () => Array.from(store.providerSessions.values()));

app.post("/tasks/intents", async (request, reply) => {
  const payload = TaskIntentSchema.omit({ id: true, state: true, createdAt: true, updatedAt: true }).parse(request.body);
  const result = orchestrateIntent(store, payload);
  return reply.code(201).send(result);
});

app.get("/tasks/runs/:runId", async (request, reply) => {
  const params = request.params as { runId: string };
  const run = store.runs.get(params.runId);
  if (!run) {
    return reply.code(404).send({ message: "Run not found" });
  }
  return run;
});

app.post("/approvals/:approvalId/decision", async (request, reply) => {
  const params = request.params as { approvalId: string };
  const payload = ApprovalRequestSchema.pick({ status: true, reviewer: true }).parse(request.body);
  if (!["approved", "rejected", "changes_requested"].includes(payload.status)) {
    return reply.code(400).send({ message: "Invalid decision" });
  }

  const approval = store.approvals.get(params.approvalId);
  if (!approval) {
    return reply.code(404).send({ message: "Approval request not found" });
  }

  approval.status = payload.status;
  approval.reviewer = payload.reviewer;
  approval.resolvedAt = now();
  store.approvals.set(approval.id, approval);
  persistApprovals(store.approvals);

  const run = store.runs.get(approval.taskRunId);
  if (!run) {
    return reply.code(404).send({ message: "Task run not found" });
  }

  appendAuditRecord(
    AuditRecordSchema.parse({
      id: id("audit"),
      occurredAt: now(),
      actor: { type: "user", id: payload.reviewer ?? "unknown-reviewer" },
      action: "approval.resolved",
      targetType: "approval_request",
      targetId: approval.id,
      metadata: { status: approval.status, taskRunId: run.id }
    })
  );

  if (payload.status === "approved") {
    publishRun(store, run.id, payload.reviewer ?? "human-approver");
  } else {
    guardTransition(run.state, "blocked", { reason: "approval rejected or changes requested" });
    run.state = "blocked";
    run.updatedAt = now();
  }

  return { approval, run };
});

app.get("/approvals", async () => Array.from(store.approvals.values()));

app.get("/audit/records", async () => readAuditLog());

app.get("/audit/runs/:runId", async (request) => {
  const params = request.params as { runId: string };
  return readAuditLog().filter(
    (record) =>
      record.targetId === params.runId ||
      (typeof record.metadata.taskRunId === "string" && record.metadata.taskRunId === params.runId) ||
      (typeof record.metadata.runId === "string" && record.metadata.runId === params.runId)
  );
});

const port = Number(process.env.PORT ?? 4000);
app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
