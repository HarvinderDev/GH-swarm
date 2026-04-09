import { emitExternalAction } from "../../shared/src/audit.js";
import type {
  DraftPullRequestInput,
  GitHubIntegration,
  GitHubIntegrationDependencies,
  GitHubIssueContext,
  GitHubIssueContextRequest,
  PullRequestUpdateInput,
  StatusCommentInput
} from "./types.js";

export class MockGitHubIntegration implements GitHubIntegration {
  constructor(private readonly deps: GitHubIntegrationDependencies) {}

  async ingestIssueContext(
    input: GitHubIssueContextRequest
  ): Promise<GitHubIssueContext> {
    const issueContext: GitHubIssueContext = {
      issueTitle: `[dry-run] #${input.issueNumber} from ${input.owner}/${input.repo}`,
      issueBody: "Mocked issue body for offline environments.",
      comments: [{ author: "mock-bot", body: "Mock comment for planning." }],
      evidencePointers: [`mock://github/${input.owner}/${input.repo}/issues/${input.issueNumber}`]
    };

    await emitExternalAction(this.deps.auditSink, {
      integration: "github",
      action: "ingest_issue_context",
      actor: input.actor,
      intent: "Gather issue and PR context for planning",
      payloadSummary: {
        owner: input.owner,
        repo: input.repo,
        issueNumber: input.issueNumber,
        mode: "dry-run"
      },
      result: "success",
      evidencePointers: issueContext.evidencePointers
    });

    return issueContext;
  }

  async createDraftPr(input: DraftPullRequestInput): Promise<{ pullNumber: number; url: string }> {
    const url = `mock://github/${input.owner}/${input.repo}/pull/101`;
    await emitExternalAction(this.deps.auditSink, {
      integration: "github",
      action: "create_draft_pr",
      actor: input.actor,
      intent: "Create draft pull request",
      payloadSummary: {
        owner: input.owner,
        repo: input.repo,
        base: input.base,
        head: input.head,
        title: input.title,
        mode: "dry-run"
      },
      result: "success",
      evidencePointers: [url]
    });
    return { pullNumber: 101, url };
  }

  async updateDraftPr(input: PullRequestUpdateInput): Promise<{ pullNumber: number; url: string }> {
    const url = `mock://github/${input.owner}/${input.repo}/pull/${input.pullNumber}`;
    await emitExternalAction(this.deps.auditSink, {
      integration: "github",
      action: "update_draft_pr",
      actor: input.actor,
      intent: "Update existing draft pull request",
      payloadSummary: {
        owner: input.owner,
        repo: input.repo,
        pullNumber: input.pullNumber,
        title: input.title,
        state: input.state,
        mode: "dry-run"
      },
      result: "success",
      evidencePointers: [url]
    });
    return { pullNumber: input.pullNumber, url };
  }

  async postStatusComment(input: StatusCommentInput): Promise<{ commentUrl: string }> {
    const commentUrl = `mock://github/${input.owner}/${input.repo}/issues/${input.issueNumber}/comments/1`;
    await emitExternalAction(this.deps.auditSink, {
      integration: "github",
      action: "post_status_comment",
      actor: input.actor,
      intent: "Publish run status to GitHub issue or PR",
      payloadSummary: {
        owner: input.owner,
        repo: input.repo,
        issueNumber: input.issueNumber,
        bodyPreview: input.body.slice(0, 120),
        mode: "dry-run"
      },
      result: "success",
      evidencePointers: [commentUrl]
    });
    return { commentUrl };
  }
}
