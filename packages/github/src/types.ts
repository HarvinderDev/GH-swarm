import type { AuditActor, AuditSink } from "../../shared/src/audit.js";

export type GitHubIssueContextRequest = {
  owner: string;
  repo: string;
  issueNumber: number;
  actor: AuditActor;
};

export type DraftPullRequestInput = {
  owner: string;
  repo: string;
  base: string;
  head: string;
  title: string;
  body: string;
  draft: true;
  actor: AuditActor;
};

export type PullRequestUpdateInput = {
  owner: string;
  repo: string;
  pullNumber: number;
  title?: string;
  body?: string;
  state?: "open" | "closed";
  actor: AuditActor;
};

export type StatusCommentInput = {
  owner: string;
  repo: string;
  issueNumber: number;
  body: string;
  actor: AuditActor;
};

export type GitHubIssueContext = {
  issueTitle: string;
  issueBody: string;
  comments: Array<{ author: string; body: string }>;
  evidencePointers: string[];
};

export interface GitHubIntegration {
  ingestIssueContext(input: GitHubIssueContextRequest): Promise<GitHubIssueContext>;
  createDraftPr(input: DraftPullRequestInput): Promise<{ pullNumber: number; url: string }>;
  updateDraftPr(input: PullRequestUpdateInput): Promise<{ pullNumber: number; url: string }>;
  postStatusComment(input: StatusCommentInput): Promise<{ commentUrl: string }>;
}

export type GitHubIntegrationDependencies = {
  auditSink: AuditSink;
  token?: string;
  liveEnabled: boolean;
  dryRunDefault: boolean;
};
