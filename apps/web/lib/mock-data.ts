import {
  ApprovalRequest,
  OnboardingStatus,
  TaskIntent,
  TaskRun,
  WorkspaceDashboard
} from "@/lib/types";

const githubLive = process.env.GITHUB_INTEGRATION_MODE === "live";
const providerLive = process.env.PROVIDER_MODE === "live";

export const onboardingStatus: OnboardingStatus = {
  workspaceName: "Default Workspace",
  integrations: [
    {
      key: "github",
      state: githubLive ? "live" : "degraded",
      message: githubLive
        ? "GitHub app installation detected and token exchange healthy."
        : "GitHub credentials unavailable. API uses dry-run publish with mock PR URLs.",
      action: githubLive ? "Continue with repository import" : "Connect GitHub App or PAT"
    },
    {
      key: "provider",
      state: providerLive ? "live" : "mock",
      message: providerLive
        ? "Codex provider session is discoverable via local CLI/session reuse."
        : "Codex provider not available. Provider adapter is in mock mode.",
      action: providerLive ? "Acquire provider session" : "Install/auth Codex CLI"
    }
  ],
  localReposDiscovered: ["acme/api", "acme/web", "acme/docs"],
  nextStep: "Choose repos and runner preference to complete setup."
};

export const dashboard: WorkspaceDashboard = {
  workspaceId: "ws_default",
  workspaceName: "Default Workspace",
  queueDepth: 2,
  repos: [
    {
      id: "acme-web",
      name: "acme/web",
      health: "healthy",
      openTasks: 3,
      activeRuns: 1,
      failingChecks: 0,
      runnerMode: "local"
    },
    {
      id: "acme-api",
      name: "acme/api",
      health: "attention",
      openTasks: 6,
      activeRuns: 2,
      failingChecks: 1,
      runnerMode: "remote"
    }
  ]
};

const taskIntents: TaskIntent[] = [];

export function createTaskIntent(repoId: string, prompt: string): TaskIntent {
  const id = `intent_${Date.now()}`;
  const intent: TaskIntent = {
    id,
    repoId,
    prompt,
    createdAt: new Date().toISOString(),
    status: "queued"
  };
  taskIntents.unshift(intent);
  return intent;
}

export function listTaskIntents(): TaskIntent[] {
  return taskIntents;
}

export const runs: Record<string, TaskRun> = {
  run_1001: {
    runId: "run_1001",
    repoId: "acme-web",
    intentId: "intent_seed_1",
    providerState: providerLive ? "live" : "mock",
    githubState: githubLive ? "live" : "degraded",
    timeline: [
      {
        stage: "plan",
        title: "Planner generated task plan",
        status: "done",
        detail:
          "Generated scoped implementation plan with 4 files and explicit policy checks.",
        artifact: "artifacts/run_1001/plan.md"
      },
      {
        stage: "execution",
        title: "Implementer applied code changes",
        status: "done",
        detail: "Applied changes to UI and API contracts in draft branch.",
        artifact: "artifacts/run_1001/patch.diff"
      },
      {
        stage: "validation",
        title: "Validator executed checks",
        status: "running",
        detail: providerLive
          ? "Running lint/typecheck/test on local runner."
          : "Validation simulated because provider integration is in mock mode.",
        artifact: "artifacts/run_1001/validation.log"
      },
      {
        stage: "review",
        title: "Reviewer pending human gate",
        status: "pending",
        detail: "Awaiting operator decision before publish actions."
      }
    ]
  }
};

export const approvals: ApprovalRequest[] = [
  {
    id: "approval_5001",
    runId: "run_1001",
    repoId: "acme-web",
    summary: "Approve draft PR update for onboarding UX reliability improvements.",
    status: "pending"
  }
];

export function updateApproval(
  id: string,
  status: ApprovalRequest["status"]
): ApprovalRequest | null {
  const existing = approvals.find((entry) => entry.id === id);
  if (!existing) {
    return null;
  }
  existing.status = status;
  return existing;
}
