export type IntegrationState = "live" | "degraded" | "mock";

export interface IntegrationStatus {
  key: "github" | "provider";
  state: IntegrationState;
  message: string;
  action: string;
}

export interface OnboardingStatus {
  workspaceName: string;
  integrations: IntegrationStatus[];
  localReposDiscovered: string[];
  nextStep: string;
}

export interface RepoSummary {
  id: string;
  name: string;
  health: "healthy" | "attention" | "blocked";
  openTasks: number;
  activeRuns: number;
  failingChecks: number;
  runnerMode: "local" | "remote";
}

export interface WorkspaceDashboard {
  workspaceId: string;
  workspaceName: string;
  repos: RepoSummary[];
  queueDepth: number;
}

export interface TaskIntent {
  id: string;
  repoId: string;
  prompt: string;
  createdAt: string;
  status: "queued" | "running" | "awaiting_approval";
}

export interface RunTimelineEvent {
  stage: "plan" | "execution" | "validation" | "review";
  title: string;
  status: "pending" | "running" | "done" | "blocked";
  detail: string;
  artifact?: string;
}

export interface TaskRun {
  runId: string;
  repoId: string;
  intentId: string;
  providerState: IntegrationState;
  githubState: IntegrationState;
  timeline: RunTimelineEvent[];
}

export interface ApprovalRequest {
  id: string;
  runId: string;
  repoId: string;
  summary: string;
  status: "pending" | "approved" | "rejected" | "changes_requested";
}
