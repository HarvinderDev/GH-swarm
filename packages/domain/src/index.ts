export type TaskLifecycleState =
  | 'discovered'
  | 'triaged'
  | 'planned'
  | 'queued'
  | 'running'
  | 'validating'
  | 'awaiting_approval'
  | 'publishing'
  | 'published'
  | 'blocked'
  | 'failed'
  | 'archived';

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
}

export interface Repo {
  id: string;
  workspaceId: string;
  name: string;
  fullName: string;
  defaultBranch: string;
}

export interface TaskIntent {
  id: string;
  workspaceId: string;
  repoId: string;
  prompt: string;
  state: TaskLifecycleState;
  createdAt: string;
}

export interface TaskPlan {
  id: string;
  intentId: string;
  steps: string[];
  state: TaskLifecycleState;
  createdAt: string;
}

export interface TaskRun {
  id: string;
  planId: string;
  state: TaskLifecycleState;
  timeline: RunTimelineEvent[];
  artifacts: RunArtifact[];
  createdAt: string;
}

export interface RunTimelineEvent {
  at: string;
  state: TaskLifecycleState;
  note: string;
}

export interface RunArtifact {
  id: string;
  kind: 'plan' | 'execution_log' | 'validation_report' | 'review_report' | 'publish_result';
  body: string;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  runId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
}
