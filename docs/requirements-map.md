# Requirements Map

## Source hierarchy
- Product scope and acceptance direction: `PLAN.md`.
- Execution discipline and workflow constraints: `AGENTS.md`.
- In case of conflict, this map follows `PLAN.md` for product requirements and `AGENTS.md` for operating workflow.

## Must-have scope for V1 (no feature flag)

### Product and UX
- Dashboard + embedded chat as the primary operator surface (not terminal-first).
- Self-hosted-first runtime.
- Multi-repo workspace support.
- Onboarding flow covering GitHub connection, provider/session detection, repo registration, and runner preference.
- Core operator views:
  - Workspace overview with repo filtering.
  - Portfolio inbox for all task sources.
  - Repo control view for queue/runs/PR/checks/artifacts.
  - Run detail timeline (intent, plan, execution, validation, review, publish state).
  - Approval UI with human-gated publish decisions.

### Execution and orchestration
- Persistent control plane components: web app, API, worker/scheduler, queue, DB, policy engine, notification service, provider/session manager, runner manager, artifact and audit stores.
- Execution targets:
  - Local runner support.
  - Remote runner model and routing boundary.
- Role-based orchestration lifecycle with stable roles:
  - scout, planner, implementer, validator, reviewer, publisher.
- Typed lifecycle states:
  - discovered, triaged, planned, queued, running, validating, awaiting_approval, publishing, published, blocked, failed, archived.

### Integrations and provider model
- Provider abstraction boundary (provider-core) with capability flags.
- Required provider contract operations:
  - `healthCheck`, `listSessions`, `acquireSession`, `planTask`, `executeTask`, `validateTask`, `reviewTask`, `summarizeTask`, `parseIntent`, `supportsRemoteExecution`.
- Codex adapter as first-class provider implementation.
- Common auth path must prefer official/documented flows and installed CLI/session reuse.
- GitHub integration for issue/PR context, issue comments, status summaries, branch push, and draft PR creation/update.

### Governance and safety
- Policy engine deciding autonomy scope, runner usage, publish permissions, and mandatory human review.
- Hard-stop categories that always require human control:
  - merge, deploy, secrets/auth mutations (unless explicitly approved), destructive data actions, production infrastructure mutation.
- Full auditability of external actions tied to evidence/artifacts.

### Required vertical slice (must work before breadth expansion)
1. User opens dashboard.
2. Completes onboarding.
3. Adds repo/workspace.
4. Sees Codex health/session detection or explicit degraded fallback.
5. Submits chat intent (e.g., “fix this issue and prepare a PR”).
6. System creates TaskIntent -> TaskPlan -> TaskRun.
7. Runner executes via provider adapter.
8. Validator verifies.
9. Reviewer judges.
10. Dashboard shows artifacts/timeline.
11. Human approves.
12. System pushes branch and opens/updates draft PR when GitHub auth exists.
13. If live publish unavailable, dry-run/mocks demonstrate full path.

## Feature-flagged / deferred-but-planned scope
These are planned in roadmap phases but can be controlled by feature flags or staged rollout until the vertical slice is stable:

- Telegram quick-action surface (approve/reject/status + deep links).
- Scheduled scans and recurring maintenance campaigns.
- Advanced multi-repo prioritization and portfolio automation tuning.
- Remote runner full production deployment path (beyond local model and mock/simulated behavior).
- Enhanced notification fanout channels beyond baseline operator-facing notifications.

## Non-negotiable constraints
- Never implement credential scraping, cookie extraction, or undocumented auth hacks.
- Merge and deploy remain human-gated at all times.
- CLI remains admin/debug/fallback only, not primary UX.
- Strong typing and explicit domain/API contracts are required.
- Prefer real runnable boundaries; use dry-run/mock only where live credentials/infrastructure are unavailable.

## Acceptance summary
A milestone is only complete when:
- Relevant quality gates pass (lint, typecheck, tests, build).
- Required artifacts and audit records are present for executed flows.
- Human-gated controls are enforced for merge/deploy and other hard-stop operations.
- Documentation captures verified local behavior vs live-E2E dependencies.
