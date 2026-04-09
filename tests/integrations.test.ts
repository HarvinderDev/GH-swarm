import { describe, expect, it } from "vitest";
import { createGitHubIntegration } from "../packages/github/src/index.js";
import { NotificationService } from "../packages/notifications/src/service.js";
import { RunnerRouter } from "../packages/runners/src/router.js";
import { InMemoryAuditSink } from "../packages/shared/src/audit.js";

const actor = { id: "system:orchestrator", type: "system" } as const;

describe("integration packages", () => {
  it("uses GitHub dry-run fallback and emits audit artifacts", async () => {
    const sink = new InMemoryAuditSink();
    const github = createGitHubIntegration({
      auditSink: sink,
      liveEnabled: false,
      dryRunDefault: true
    });

    const issue = await github.ingestIssueContext({
      owner: "acme",
      repo: "demo",
      issueNumber: 123,
      actor
    });
    const pr = await github.createDraftPr({
      owner: "acme",
      repo: "demo",
      base: "main",
      head: "codex/task-123",
      title: "Fix issue #123",
      body: "Implements the fix",
      draft: true,
      actor
    });

    expect(issue.issueTitle).toContain("[dry-run]");
    expect(pr.pullNumber).toBeGreaterThan(0);
    expect(sink.artifacts.length).toBe(2);
    expect(sink.artifacts[0]?.payloadSummary).toMatchObject({ mode: "dry-run" });
  });

  it("routes runner tasks according to policy and emits artifacts", async () => {
    const sink = new InMemoryAuditSink();
    const router = new RunnerRouter({
      auditSink: sink,
      remoteEnabled: true,
      remoteEndpoint: "https://runner.example.com",
      dryRunDefault: true,
      routingPolicy: {
        preferRemote: false,
        remoteEligibleTaskPrefixes: ["remote-"]
      }
    });

    const remoteResult = await router.run({
      taskId: "remote-7",
      repoPath: "/tmp",
      command: "echo hi",
      actor,
      intent: "Validate remote routing"
    });

    expect(remoteResult.runnerKind).toBe("remote");
    expect(remoteResult.stdout).toContain("dry-run");
    expect(sink.artifacts.at(-1)?.integration).toBe("runners");
  });

  it("fans out notifications to in-app and telegram dry-run adapters", async () => {
    const sink = new InMemoryAuditSink();
    const service = new NotificationService({
      auditSink: sink,
      telegramLiveEnabled: false,
      dryRunDefault: true
    });

    const result = await service.notify({
      actor,
      intent: "Notify operator about run completion",
      title: "Run finished",
      body: "Task run #42 completed successfully",
      runId: "run-42",
      link: "https://dashboard/runs/42"
    });

    expect(result.inApp.evidencePointers[0]).toContain("db://notifications");
    expect(result.telegram.evidencePointers[0]).toContain("mock://telegram");
    expect(sink.artifacts.map((item) => item.action)).toEqual(
      expect.arrayContaining([
        "send_in_app_notification",
        "send_telegram_notification"
      ])
    );
  });
});
