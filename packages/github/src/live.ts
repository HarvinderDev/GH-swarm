import { Octokit } from "@octokit/rest";
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

export class LiveGitHubIntegration implements GitHubIntegration {
  private readonly client: Octokit;

  constructor(private readonly deps: GitHubIntegrationDependencies) {
    if (!deps.token) {
      throw new Error("GitHub token required for live integration");
    }
    this.client = new Octokit({ auth: deps.token });
  }

  async ingestIssueContext(input: GitHubIssueContextRequest): Promise<GitHubIssueContext> {
    try {
      const [issueRes, commentsRes] = await Promise.all([
        this.client.issues.get({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.issueNumber
        }),
        this.client.issues.listComments({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.issueNumber,
          per_page: 20
        })
      ]);

      const evidence = [issueRes.data.html_url, ...commentsRes.data.map((c) => c.html_url || "")].filter(Boolean);
      await emitExternalAction(this.deps.auditSink, {
        integration: "github",
        action: "ingest_issue_context",
        actor: input.actor,
        intent: "Gather issue and PR context for planning",
        payloadSummary: {
          owner: input.owner,
          repo: input.repo,
          issueNumber: input.issueNumber,
          commentCount: commentsRes.data.length,
          mode: "live"
        },
        result: "success",
        evidencePointers: evidence
      });

      return {
        issueTitle: issueRes.data.title,
        issueBody: issueRes.data.body || "",
        comments: commentsRes.data.map((comment) => ({
          author: comment.user?.login || "unknown",
          body: comment.body || ""
        })),
        evidencePointers: evidence
      };
    } catch (error) {
      await emitExternalAction(this.deps.auditSink, {
        integration: "github",
        action: "ingest_issue_context",
        actor: input.actor,
        intent: "Gather issue and PR context for planning",
        payloadSummary: { owner: input.owner, repo: input.repo, issueNumber: input.issueNumber, mode: "live" },
        result: "failure",
        evidencePointers: [],
        error: String(error)
      });
      throw error;
    }
  }

  async createDraftPr(input: DraftPullRequestInput): Promise<{ pullNumber: number; url: string }> {
    try {
      const response = await this.client.pulls.create({
        owner: input.owner,
        repo: input.repo,
        base: input.base,
        head: input.head,
        title: input.title,
        body: input.body,
        draft: true
      });
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
          mode: "live"
        },
        result: "success",
        evidencePointers: [response.data.html_url]
      });
      return { pullNumber: response.data.number, url: response.data.html_url };
    } catch (error) {
      await emitExternalAction(this.deps.auditSink, {
        integration: "github",
        action: "create_draft_pr",
        actor: input.actor,
        intent: "Create draft pull request",
        payloadSummary: { owner: input.owner, repo: input.repo, base: input.base, head: input.head, mode: "live" },
        result: "failure",
        evidencePointers: [],
        error: String(error)
      });
      throw error;
    }
  }

  async updateDraftPr(input: PullRequestUpdateInput): Promise<{ pullNumber: number; url: string }> {
    try {
      const response = await this.client.pulls.update({
        owner: input.owner,
        repo: input.repo,
        pull_number: input.pullNumber,
        title: input.title,
        body: input.body,
        state: input.state
      });

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
          mode: "live"
        },
        result: "success",
        evidencePointers: [response.data.html_url]
      });

      return { pullNumber: response.data.number, url: response.data.html_url };
    } catch (error) {
      await emitExternalAction(this.deps.auditSink, {
        integration: "github",
        action: "update_draft_pr",
        actor: input.actor,
        intent: "Update existing draft pull request",
        payloadSummary: { owner: input.owner, repo: input.repo, pullNumber: input.pullNumber, mode: "live" },
        result: "failure",
        evidencePointers: [],
        error: String(error)
      });
      throw error;
    }
  }

  async postStatusComment(input: StatusCommentInput): Promise<{ commentUrl: string }> {
    try {
      const response = await this.client.issues.createComment({
        owner: input.owner,
        repo: input.repo,
        issue_number: input.issueNumber,
        body: input.body
      });
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
          mode: "live"
        },
        result: "success",
        evidencePointers: [response.data.html_url]
      });
      return { commentUrl: response.data.html_url };
    } catch (error) {
      await emitExternalAction(this.deps.auditSink, {
        integration: "github",
        action: "post_status_comment",
        actor: input.actor,
        intent: "Publish run status to GitHub issue or PR",
        payloadSummary: { owner: input.owner, repo: input.repo, issueNumber: input.issueNumber, mode: "live" },
        result: "failure",
        evidencePointers: [],
        error: String(error)
      });
      throw error;
    }
  }
}
