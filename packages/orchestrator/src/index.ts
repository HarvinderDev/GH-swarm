import { randomUUID } from 'node:crypto';
import type { ProviderAdapter } from '@swarm/provider-core';
import type { ApprovalRequest, Repo, TaskIntent, TaskPlan, TaskRun, Workspace } from '@swarm/domain';
import { evaluatePublishPolicy } from '@swarm/policy';
import { createOrUpdateDraftPr } from '@swarm/github';

export interface RuntimeStore {
  workspaces: Workspace[];
  repos: Repo[];
  intents: TaskIntent[];
  plans: TaskPlan[];
  runs: TaskRun[];
  approvals: ApprovalRequest[];
  save?(): Promise<void>;
}

export class SwarmOrchestrator {
  constructor(private readonly provider: ProviderAdapter, private readonly store: RuntimeStore) {}

  async createWorkspace(name: string): Promise<Workspace> {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error('Workspace name is required');
    }

    const workspace: Workspace = { id: randomUUID(), name: normalizedName, createdAt: new Date().toISOString() };
    this.store.workspaces.push(workspace);
    await this.persist();
    return workspace;
  }

  async createRepo(workspaceId: string, fullName: string): Promise<Repo> {
    const workspace = this.requireWorkspace(workspaceId);
    const { owner, repoName } = parseRepoFullName(fullName);

    const repo: Repo = {
      id: randomUUID(),
      workspaceId: workspace.id,
      name: repoName,
      fullName: `${owner}/${repoName}`,
      defaultBranch: 'main'
    };

    this.store.repos.push(repo);
    await this.persist();
    return repo;
  }

  async runIntent(workspaceId: string, repoId: string, prompt: string) {
    this.requireWorkspace(workspaceId);
    const repo = this.requireRepo(repoId);
    if (repo.workspaceId !== workspaceId) {
      throw new Error('Repo does not belong to workspace');
    }

    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) {
      throw new Error('Prompt is required');
    }

    const intent: TaskIntent = {
      id: randomUUID(), workspaceId, repoId, prompt: normalizedPrompt, state: 'planned', createdAt: new Date().toISOString()
    };
    this.store.intents.push(intent);

    const planSteps = await this.provider.planTask(normalizedPrompt);
    const plan: TaskPlan = {
      id: randomUUID(), intentId: intent.id, steps: planSteps, state: 'queued', createdAt: new Date().toISOString()
    };
    this.store.plans.push(plan);

    const execution = await this.provider.executeTask(plan.steps);
    const validation = await this.provider.validateTask(execution.summary);
    const review = await this.provider.reviewTask(validation);

    const run: TaskRun = {
      id: randomUUID(),
      planId: plan.id,
      state: 'awaiting_approval',
      createdAt: new Date().toISOString(),
      timeline: [
        { at: new Date().toISOString(), state: 'planned', note: 'Task intent parsed' },
        { at: new Date().toISOString(), state: 'queued', note: 'Task plan created' },
        { at: new Date().toISOString(), state: 'running', note: execution.summary },
        { at: new Date().toISOString(), state: 'validating', note: validation },
        { at: new Date().toISOString(), state: 'awaiting_approval', note: review }
      ],
      artifacts: [
        { id: randomUUID(), kind: 'plan', body: plan.steps.join('\n'), createdAt: new Date().toISOString() },
        { id: randomUUID(), kind: 'execution_log', body: execution.artifacts.join('\n'), createdAt: new Date().toISOString() },
        { id: randomUUID(), kind: 'validation_report', body: validation, createdAt: new Date().toISOString() },
        { id: randomUUID(), kind: 'review_report', body: review, createdAt: new Date().toISOString() }
      ]
    };
    this.store.runs.push(run);

    const approval: ApprovalRequest = { id: randomUUID(), runId: run.id, status: 'pending', createdAt: new Date().toISOString() };
    this.store.approvals.push(approval);
    await this.persist();

    return { intent, plan, run, approval };
  }

  async approveAndPublish(runId: string) {
    const approval = this.requireApprovalByRun(runId);
    const run = this.requireRun(runId);

    if (approval.status === 'rejected') {
      throw new Error('Cannot approve a rejected run');
    }

    if (approval.status === 'approved') {
      const previousResult = run.artifacts.find((artifact) => artifact.kind === 'publish_result');
      return { run, publish: previousResult ? JSON.parse(previousResult.body) : null, reason: null, alreadyProcessed: true };
    }

    const decision = evaluatePublishPolicy('draft_pr');
    if (!decision.allowed) {
      approval.status = 'rejected';
      approval.resolvedAt = new Date().toISOString();
      run.state = 'blocked';
      await this.persist();
      return { run, publish: null, reason: decision.reason, alreadyProcessed: false };
    }

    approval.status = 'approved';
    approval.resolvedAt = new Date().toISOString();
    run.state = 'publishing';

    const repo = this.resolveRepoForRun(run.id);
    const publish = await createOrUpdateDraftPr({
      owner: repo.owner,
      repo: repo.name,
      branch: `swarm/${run.id.slice(0, 8)}`,
      title: 'Automated change',
      body: 'Generated by codex-github-swarm'
    });

    run.timeline.push({ at: new Date().toISOString(), state: 'publishing', note: publish.message });
    run.artifacts.push({ id: randomUUID(), kind: 'publish_result', body: JSON.stringify(publish), createdAt: new Date().toISOString() });
    run.state = 'published';
    await this.persist();

    return { run, publish, reason: null, alreadyProcessed: false };
  }

  async rejectApproval(runId: string, reason = 'Rejected by operator') {
    const approval = this.requireApprovalByRun(runId);
    const run = this.requireRun(runId);

    if (approval.status === 'approved') {
      throw new Error('Cannot reject an approved run');
    }

    if (approval.status === 'rejected') {
      return { run, approval, alreadyProcessed: true };
    }

    approval.status = 'rejected';
    approval.resolvedAt = new Date().toISOString();
    run.state = 'blocked';
    run.timeline.push({ at: new Date().toISOString(), state: 'blocked', note: reason });
    await this.persist();

    return { run, approval, alreadyProcessed: false };
  }

  private requireWorkspace(workspaceId: string): Workspace {
    const workspace = this.store.workspaces.find((item) => item.id === workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  }

  private requireRepo(repoId: string): Repo {
    const repo = this.store.repos.find((item) => item.id === repoId);
    if (!repo) {
      throw new Error('Repo not found');
    }
    return repo;
  }

  private requireRun(runId: string): TaskRun {
    const run = this.store.runs.find((item) => item.id === runId);
    if (!run) {
      throw new Error('Run not found');
    }
    return run;
  }

  private requireApprovalByRun(runId: string): ApprovalRequest {
    const approval = this.store.approvals.find((item) => item.runId === runId);
    if (!approval) {
      throw new Error('Approval request not found');
    }
    return approval;
  }

  private resolveRepoForRun(runId: string): { owner: string; name: string } {
    const run = this.requireRun(runId);
    const plan = this.store.plans.find((item) => item.id === run.planId);
    if (!plan) {
      throw new Error('Plan not found for run');
    }

    const intent = this.store.intents.find((item) => item.id === plan.intentId);
    if (!intent) {
      throw new Error('Intent not found for run');
    }

    const repo = this.requireRepo(intent.repoId);
    const { owner, repoName } = parseRepoFullName(repo.fullName);
    return { owner, name: repoName };
  }

  private async persist() {
    if (this.store.save) {
      await this.store.save();
    }
  }
}

function parseRepoFullName(fullName: string): { owner: string; repoName: string } {
  const normalized = fullName.trim();
  const match = /^(?<owner>[A-Za-z0-9_.-]+)\/(?<repo>[A-Za-z0-9_.-]+)$/.exec(normalized);
  if (!match?.groups?.owner || !match.groups.repo) {
    throw new Error('Repo fullName must be in owner/repo format');
  }

  return { owner: match.groups.owner, repoName: match.groups.repo };
}
