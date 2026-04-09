# Architecture

## Architectural goals
- Deliver a production-grade, self-hosted, dashboard-first system for conversational engineering automation on GitHub repositories.
- Preserve strict provider abstraction while making Codex first-class.
- Enable near-full autonomy for plan/code/test/push/draft-PR with explicit human gates for merge/deploy.
- Maintain strong auditability, policy enforcement, and recoverable run state.

## Monorepo structure (target)
- `apps/web`: Next.js dashboard + onboarding + embedded chat + approvals UI.
- `apps/api`: Fastify control plane API.
- `apps/worker`: scheduler and queue workers (orchestration execution, scan jobs, notifications).
- `packages/domain`: typed entities, lifecycle enums, domain services/contracts.
- `packages/db`: schema, migrations, repositories.
- `packages/orchestrator`: role engine state machine and run coordination.
- `packages/provider-core`: provider adapter interface and capability model.
- `packages/provider-codex`: Codex adapter implementation via official/CLI-backed path.
- `packages/github`: GitHub integration (issues, branches, comments, draft PRs).
- `packages/runners`: local/remote runner abstractions and execution adapters.
- `packages/notifications`: Telegram + other channel orchestration.
- `packages/policy`: governance and authorization decisions for autonomy and publish.
- `packages/shared` / `packages/ui`: shared schemas, utilities, and UI components.
- `packages/cli-admin`: admin/debug wrappers around API services.

## Runtime topology
- **Web dashboard (Next.js):** operator UI and embedded chat.
- **API control plane (Fastify):** authoritative command/query boundary.
- **Worker plane (Node workers):** asynchronous task processing and scheduler.
- **PostgreSQL:** source-of-truth state for domain entities, runs, approvals, policies, audits.
- **Redis queue:** durable background work dispatch and retry control.
- **Artifact storage (filesystem/S3-compatible):** logs, run evidence, generated artifacts.

## Domain model and state
Core entities:
- Workspace, Repo, RepoProfile, ProviderSession, Runner.
- TaskIntent, TaskCandidate, TaskPlan, TaskRun.
- ApprovalRequest, PublishRecord, Notification, PolicyRule, Artifact.

State progression:
- `discovered -> triaged -> planned -> queued -> running -> validating -> awaiting_approval -> publishing -> published`
- Exception branches: `blocked`, `failed`, `archived`.

## Control-plane flow
1. Operator submits natural-language intent from dashboard chat.
2. API resolves workspace/repo context and creates TaskIntent.
3. Orchestrator creates TaskPlan and queues TaskRun.
4. Worker claims run, resolves provider session and runner route.
5. Provider adapter executes role steps (planner/implementer/validator/reviewer).
6. Artifacts and audit events are persisted after each state transition.
7. If publish policy requires approval, system creates ApprovalRequest and pauses.
8. On approval, publish service performs push/comment/draft-PR actions via GitHub integration.

## Provider architecture
- All provider behavior is behind `provider-core` contract with capability flags.
- `provider-codex` implements required contract methods and CLI/session discovery.
- Degraded mode behavior is explicit when Codex is unavailable:
  - health reports unavailable.
  - UI shows actionable fallback state.
  - dry-run mode keeps orchestration/test paths executable.

## Runner architecture
- Local runners execute against operator-hosted repositories for fast inner-loop tasks.
- Remote runner interface supports queued/heavy/unattended workloads.
- Runner manager performs policy-aware routing based on repo settings and task class.

## Policy and audit architecture
- Policy engine evaluates:
  - repo/task eligibility for automation,
  - runner constraints,
  - publish permissions,
  - human-review requirements.
- Hard-stop actions (merge/deploy/etc.) are blocked in automation path.
- Audit ledger stores initiator, provider session, runner, prompts/contracts, generated artifacts, external actions, approvals, and overrides.

## Integration boundaries
- **GitHub boundary:** Octokit-backed service for issues, branches, comments, draft PRs, status updates.
- **Telegram boundary:** secondary quick-action channel for approve/reject/status and deep links back to dashboard.
- **Codex boundary:** official/documented auth and CLI/session reuse; no undocumented credential extraction.

## Key architecture decisions and rationale
1. **Dashboard-first + API-centric control plane:** preserves product goal and keeps CLI as fallback.
2. **Typed domain packages:** enforces explicit contracts and maintainability.
3. **Queue-backed orchestration:** enables recoverable long-running work and resilience.
4. **Provider adapter boundary:** avoids vendor lock-in while supporting Codex-first delivery.
5. **Human-gated publish controls:** aligns with safety requirements and governance model.
