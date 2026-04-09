import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ApprovalRequest,
  Artifact,
  AuditRecord,
  PolicyRule,
  ProviderSession,
  PublishRecord,
  Repo,
  TaskIntent,
  TaskPlan,
  TaskRun
} from "@codex-swarm/domain";

const now = () => new Date().toISOString();
const resolveDataPath = (name: string) => fileURLToPath(new URL(`../data/${name}`, import.meta.url));

export type DataStore = {
  repos: Map<string, Repo>;
  providerSessions: Map<string, ProviderSession>;
  intents: Map<string, TaskIntent>;
  plans: Map<string, TaskPlan>;
  runs: Map<string, TaskRun>;
  approvals: Map<string, ApprovalRequest>;
  publishes: Map<string, PublishRecord>;
  artifacts: Map<string, Artifact>;
  policies: Map<string, PolicyRule>;
};

const approvalsPath = resolveDataPath("approvals.json");
const auditLogPath = resolveDataPath("audit-log.jsonl");

function ensurePath(path: string): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function loadApprovals(): Map<string, ApprovalRequest> {
  ensurePath(approvalsPath);
  if (!existsSync(approvalsPath)) {
    return new Map();
  }
  const raw = readFileSync(approvalsPath, "utf8");
  if (!raw.trim()) return new Map();
  const parsed = JSON.parse(raw) as ApprovalRequest[];
  return new Map(parsed.map((record) => [record.id, record]));
}

export function persistApprovals(approvals: Map<string, ApprovalRequest>): void {
  ensurePath(approvalsPath);
  writeFileSync(approvalsPath, JSON.stringify(Array.from(approvals.values()), null, 2));
}

export function appendAuditRecord(record: AuditRecord): void {
  ensurePath(auditLogPath);
  appendFileSync(auditLogPath, `${JSON.stringify(record)}\n`, "utf8");
}

export function readAuditLog(): AuditRecord[] {
  ensurePath(auditLogPath);
  if (!existsSync(auditLogPath)) {
    return [];
  }
  const content = readFileSync(auditLogPath, "utf8");
  return content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as AuditRecord);
}

export function createStore(): DataStore {
  const bootPolicies: PolicyRule[] = [
    {
      id: "policy-merge-human-gated",
      name: "Merge requires explicit human approval",
      enabled: true,
      condition: { action: "merge", requiresHumanApproval: true },
      createdAt: now(),
      updatedAt: now()
    },
    {
      id: "policy-deploy-human-gated",
      name: "Deploy requires explicit human approval",
      enabled: true,
      condition: { action: "deploy", requiresHumanApproval: true },
      createdAt: now(),
      updatedAt: now()
    },
    {
      id: "policy-prod-infra-human-gated",
      name: "Production infra mutation requires explicit human approval",
      enabled: true,
      condition: { action: "prod_infra", requiresHumanApproval: true },
      createdAt: now(),
      updatedAt: now()
    }
  ];

  return {
    repos: new Map(),
    providerSessions: new Map(),
    intents: new Map(),
    plans: new Map(),
    runs: new Map(),
    approvals: loadApprovals(),
    publishes: new Map(),
    artifacts: new Map(),
    policies: new Map(bootPolicies.map((rule) => [rule.id, rule]))
  };
}
