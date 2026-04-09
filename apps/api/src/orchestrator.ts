import {
  ApprovalRequestSchema,
  ArtifactSchema,
  AuditRecordSchema,
  LifecycleStateSchema,
  PolicyDecisionSchema,
  PublishRecordSchema,
  TaskIntentSchema,
  TaskPlanSchema,
  TaskRunSchema,
  guardTransition,
  type PolicyDecision,
  type PolicyRule,
  type TaskIntent,
  type TaskPlan,
  type TaskRun
} from "@codex-swarm/domain";
import type { DataStore } from "./store.js";
import { appendAuditRecord, persistApprovals } from "./store.js";

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const highRiskActions = new Set(["merge", "deploy", "secrets_change", "destructive_data", "prod_infra"]);

function evaluatePolicy(rules: PolicyRule[], requestedActions: string[]): PolicyDecision {
  const blocked: string[] = [];
  let requiresApproval = false;

  for (const action of requestedActions) {
    if (highRiskActions.has(action)) {
      requiresApproval = true;
    }

    const rule = rules.find((candidate) => candidate.enabled && candidate.condition.action === action);
    if (rule?.condition.requiresHumanApproval) {
      requiresApproval = true;
      blocked.push(action);
    }
  }

  return PolicyDecisionSchema.parse({
    approved: true,
    reason: requiresApproval ? "Human approval required for high-risk action." : "Policy approved for autonomous execution.",
    requiresApproval,
    blockedActions: blocked
  });
}

export type OrchestrationResult = {
  intent: TaskIntent;
  plan: TaskPlan;
  run: TaskRun;
  approvalRequestId?: string;
};

export function orchestrateIntent(store: DataStore, payload: Omit<TaskIntent, "id" | "state" | "createdAt" | "updatedAt">): OrchestrationResult {
  const intent = TaskIntentSchema.parse({
    ...payload,
    id: id("intent"),
    state: "discovered",
    createdAt: now(),
    updatedAt: now()
  });

  store.intents.set(intent.id, intent);

  guardTransition(intent.state, "triaged", { reason: "orchestration intake" });
  intent.state = LifecycleStateSchema.parse("triaged");

  guardTransition(intent.state, "planned", { reason: "plan created" });
  intent.state = "planned";
  intent.updatedAt = now();

  const decision = evaluatePolicy(Array.from(store.policies.values()), intent.requestedActions);

  const plan = TaskPlanSchema.parse({
    id: id("plan"),
    intentId: intent.id,
    repoId: intent.repoId,
    summary: `Execution plan for: ${intent.title}`,
    steps: [
      { id: id("step"), label: "Analyze repository context", risk: "low" },
      { id: id("step"), label: "Implement requested changes", risk: "medium" },
      { id: id("step"), label: "Validate and prepare publish output", risk: decision.requiresApproval ? "high" : "medium" }
    ],
    requiresApproval: decision.requiresApproval,
    state: "planned",
    createdAt: now(),
    updatedAt: now()
  });
  store.plans.set(plan.id, plan);

  const initialRunState = decision.requiresApproval ? "awaiting_approval" : "publishing";
  const run = TaskRunSchema.parse({
    id: id("run"),
    planId: plan.id,
    intentId: intent.id,
    repoId: intent.repoId,
    state: initialRunState,
    logs: ["Task orchestrated", decision.reason],
    artifacts: [],
    createdAt: now(),
    updatedAt: now()
  });

  store.runs.set(run.id, run);

  const orchestrationAudit = AuditRecordSchema.parse({
    id: id("audit"),
    occurredAt: now(),
    actor: { type: "system", id: "orchestrator" },
    action: "task.orchestrated",
    targetType: "task_run",
    targetId: run.id,
    metadata: {
      intentId: intent.id,
      planId: plan.id,
      policyDecision: decision
    }
  });
  appendAuditRecord(orchestrationAudit);

  let approvalRequestId: string | undefined;
  if (decision.requiresApproval) {
    const request = ApprovalRequestSchema.parse({
      id: id("approval"),
      taskRunId: run.id,
      reason: decision.reason,
      status: "pending",
      requestedAt: now()
    });
    store.approvals.set(request.id, request);
    persistApprovals(store.approvals);
    approvalRequestId = request.id;

    appendAuditRecord(
      AuditRecordSchema.parse({
        id: id("audit"),
        occurredAt: now(),
        actor: { type: "system", id: "policy-engine" },
        action: "approval.requested",
        targetType: "approval_request",
        targetId: request.id,
        metadata: {
          taskRunId: run.id,
          blockedActions: decision.blockedActions
        }
      })
    );
  } else {
    publishRun(store, run.id, "system-auto");
  }

  return { intent, plan, run, approvalRequestId };
}

export function publishRun(store: DataStore, runId: string, actorId: string): void {
  const run = store.runs.get(runId);
  if (!run) {
    throw new Error(`Run not found: ${runId}`);
  }

  guardTransition(run.state, "publishing", { reason: "publish initiated" });
  run.state = "publishing";
  run.updatedAt = now();

  const publishRecord = PublishRecordSchema.parse({
    id: id("publish"),
    taskRunId: run.id,
    target: "draft_pr",
    status: "published",
    details: {
      mode: "mock",
      note: "Draft PR creation simulated. Merge/deploy remains human-gated."
    },
    createdAt: now(),
    updatedAt: now()
  });
  store.publishes.set(publishRecord.id, publishRecord);

  const artifact = ArtifactSchema.parse({
    id: id("artifact"),
    taskRunId: run.id,
    type: "publish_payload",
    uri: `memory://publish/${publishRecord.id}`,
    metadata: publishRecord.details,
    createdAt: now()
  });
  store.artifacts.set(artifact.id, artifact);
  run.artifacts.push(artifact.id);
  run.publishRecordId = publishRecord.id;

  guardTransition(run.state, "published", { reason: "publish completed" });
  run.state = "published";
  run.updatedAt = now();

  appendAuditRecord(
    AuditRecordSchema.parse({
      id: id("audit"),
      occurredAt: now(),
      actor: { type: "system", id: actorId },
      action: "external.github.publish",
      targetType: "publish_record",
      targetId: publishRecord.id,
      metadata: { runId }
    })
  );
}
