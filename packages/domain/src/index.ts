import { z } from "zod";

export const lifecycleStates = [
  "discovered",
  "triaged",
  "planned",
  "queued",
  "running",
  "validating",
  "awaiting_approval",
  "publishing",
  "published",
  "blocked",
  "failed",
  "archived"
] as const;

export const LifecycleStateSchema = z.enum(lifecycleStates);
export type LifecycleState = z.infer<typeof LifecycleStateSchema>;

const transitionMap: Record<LifecycleState, LifecycleState[]> = {
  discovered: ["triaged", "blocked", "archived"],
  triaged: ["planned", "blocked", "archived"],
  planned: ["queued", "blocked", "archived"],
  queued: ["running", "blocked", "archived", "failed"],
  running: ["validating", "failed", "blocked", "archived"],
  validating: ["awaiting_approval", "publishing", "failed", "blocked", "archived"],
  awaiting_approval: ["publishing", "blocked", "failed", "archived"],
  publishing: ["published", "failed", "blocked", "archived"],
  published: ["archived"],
  blocked: ["triaged", "planned", "queued", "archived", "failed"],
  failed: ["triaged", "planned", "queued", "archived"],
  archived: []
};

export function canTransition(from: LifecycleState, to: LifecycleState): boolean {
  return transitionMap[from].includes(to);
}

export function guardTransition(
  from: LifecycleState,
  to: LifecycleState,
  context: { reason?: string }
): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid lifecycle transition from ${from} to ${to}. reason=${context.reason ?? "n/a"}`);
  }
}

const IdSchema = z.string().min(1);
const IsoSchema = z.string().datetime({ offset: true });

export const WorkspaceSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  state: LifecycleStateSchema,
  repoIds: z.array(IdSchema).default([]),
  createdAt: IsoSchema,
  updatedAt: IsoSchema
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

export const RepoSchema = z.object({
  id: IdSchema,
  workspaceId: IdSchema,
  name: z.string().min(1),
  fullName: z.string().min(1),
  defaultBranch: z.string().min(1).default("main"),
  providerSessionId: IdSchema.optional(),
  state: LifecycleStateSchema,
  createdAt: IsoSchema,
  updatedAt: IsoSchema
});
export type Repo = z.infer<typeof RepoSchema>;

export const ProviderSessionSchema = z.object({
  id: IdSchema,
  provider: z.enum(["codex", "mock"]),
  accountLabel: z.string().min(1),
  healthy: z.boolean(),
  capabilities: z.object({
    planTask: z.boolean(),
    executeTask: z.boolean(),
    validateTask: z.boolean(),
    supportsRemoteExecution: z.boolean()
  }),
  lastCheckedAt: IsoSchema,
  createdAt: IsoSchema
});
export type ProviderSession = z.infer<typeof ProviderSessionSchema>;

export const TaskIntentSchema = z.object({
  id: IdSchema,
  repoId: IdSchema,
  workspaceId: IdSchema,
  title: z.string().min(3),
  prompt: z.string().min(3),
  requestedActions: z.array(z.enum(["code_change", "open_pr", "comment", "push_branch", "merge", "deploy"])),
  source: z.enum(["chat", "github_issue", "schedule", "manual"]),
  state: LifecycleStateSchema,
  createdAt: IsoSchema,
  updatedAt: IsoSchema
});
export type TaskIntent = z.infer<typeof TaskIntentSchema>;

export const TaskPlanSchema = z.object({
  id: IdSchema,
  intentId: IdSchema,
  repoId: IdSchema,
  summary: z.string().min(3),
  steps: z.array(z.object({
    id: IdSchema,
    label: z.string().min(1),
    risk: z.enum(["low", "medium", "high"])
  })),
  requiresApproval: z.boolean(),
  state: LifecycleStateSchema,
  createdAt: IsoSchema,
  updatedAt: IsoSchema
});
export type TaskPlan = z.infer<typeof TaskPlanSchema>;

export const TaskRunSchema = z.object({
  id: IdSchema,
  planId: IdSchema,
  intentId: IdSchema,
  repoId: IdSchema,
  state: LifecycleStateSchema,
  logs: z.array(z.string()).default([]),
  artifacts: z.array(IdSchema).default([]),
  publishRecordId: IdSchema.optional(),
  createdAt: IsoSchema,
  updatedAt: IsoSchema
});
export type TaskRun = z.infer<typeof TaskRunSchema>;

export const ApprovalRequestSchema = z.object({
  id: IdSchema,
  taskRunId: IdSchema,
  reason: z.string().min(1),
  status: z.enum(["pending", "approved", "rejected", "changes_requested"]),
  requestedAt: IsoSchema,
  resolvedAt: IsoSchema.optional(),
  reviewer: z.string().optional()
});
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;

export const PublishRecordSchema = z.object({
  id: IdSchema,
  taskRunId: IdSchema,
  target: z.enum(["draft_pr", "issue_comment", "branch_push", "merge", "deploy"]),
  status: z.enum(["pending", "published", "rejected"]),
  details: z.record(z.any()).default({}),
  createdAt: IsoSchema,
  updatedAt: IsoSchema
});
export type PublishRecord = z.infer<typeof PublishRecordSchema>;

export const ArtifactSchema = z.object({
  id: IdSchema,
  taskRunId: IdSchema,
  type: z.enum(["plan", "patch", "test_report", "review", "publish_payload"]),
  uri: z.string().min(1),
  metadata: z.record(z.any()).default({}),
  createdAt: IsoSchema
});
export type Artifact = z.infer<typeof ArtifactSchema>;

export const PolicyRuleSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  enabled: z.boolean(),
  condition: z.object({
    action: z.enum(["merge", "deploy", "push_branch", "open_pr", "secrets_change", "destructive_data", "prod_infra"]),
    requiresHumanApproval: z.boolean()
  }),
  createdAt: IsoSchema,
  updatedAt: IsoSchema
});
export type PolicyRule = z.infer<typeof PolicyRuleSchema>;

export const NotificationSchema = z.object({
  id: IdSchema,
  channel: z.enum(["dashboard", "telegram", "email"]),
  subject: z.string().min(1),
  body: z.string().min(1),
  recipient: z.string().min(1),
  createdAt: IsoSchema,
  readAt: IsoSchema.optional()
});
export type Notification = z.infer<typeof NotificationSchema>;

export const AuditRecordSchema = z.object({
  id: IdSchema,
  occurredAt: IsoSchema,
  actor: z.object({
    type: z.enum(["user", "system", "provider"]),
    id: z.string().min(1)
  }),
  action: z.enum([
    "external.provider.call",
    "external.github.publish",
    "approval.requested",
    "approval.resolved",
    "task.orchestrated",
    "task.transition"
  ]),
  targetType: z.enum(["task_intent", "task_plan", "task_run", "approval_request", "publish_record", "provider_session", "repo"]),
  targetId: IdSchema,
  metadata: z.record(z.any()).default({})
});
export type AuditRecord = z.infer<typeof AuditRecordSchema>;

export const PolicyDecisionSchema = z.object({
  approved: z.boolean(),
  reason: z.string().min(1),
  requiresApproval: z.boolean(),
  blockedActions: z.array(z.string()).default([])
});
export type PolicyDecision = z.infer<typeof PolicyDecisionSchema>;
