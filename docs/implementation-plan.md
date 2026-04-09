# Implementation Plan

## Planning assumptions
- Follow `PLAN.md` as source of truth for scope and sequencing.
- Execute milestone-by-milestone with verification gates after each milestone.
- Prioritize one end-to-end vertical slice before broad feature expansion.

## Milestone sequence

### Milestone 0 — Discovery, architecture, and planning docs
**Goals**
- Translate plan requirements into actionable scope.
- Define architecture, implementation sequence, verification strategy, and risk register.

**Deliverables**
- `docs/requirements-map.md`
- `docs/architecture.md`
- `docs/implementation-plan.md`
- `docs/verification-plan.md`
- `docs/risk-register.md`

**Exit criteria**
- Must-have vs feature-flagged scope is explicit.
- Architectural boundaries and runtime topology are documented.
- Verification gates and live-E2E dependencies are explicit.

### Milestone 1 — Monorepo bootstrap and engineering baseline
**Goals**
- Initialize TypeScript monorepo (`pnpm` + `turbo`) with core app/package layout.
- Establish lint/typecheck/test/build pipelines and scripts.
- Add local docker-compose baseline and CI workflow.

**Deliverables**
- Bootstrapped directories for apps/packages in target architecture.
- Root scripts: `install`, `dev`, `build`, `lint`, `typecheck`, `test`, `smoke`, `seed/demo`.
- Initial `.env.example`, compose stack, and CI.

**Exit criteria**
- Repository boots locally and CI baseline passes.

### Milestone 2 — Core domain, persistence, queue, and orchestration skeleton
**Goals**
- Implement typed domain entities and lifecycle state machine.
- Implement DB schema/migrations and repositories.
- Implement queue wiring and scheduler skeleton.
- Implement policy and audit foundations.

**Deliverables**
- Domain packages and API contracts.
- Persistence + migration setup.
- Worker processing baseline with recoverable run state.

**Exit criteria**
- TaskIntent -> TaskPlan -> queued TaskRun flow persists and can be inspected.

### Milestone 3 — Provider + GitHub integration boundaries
**Goals**
- Implement provider-core contract and Codex adapter.
- Implement session discovery/health and degraded-mode behavior.
- Implement GitHub integration for draft PR and comments.

**Deliverables**
- Working Codex provider boundary with dry-run fallback.
- GitHub publish pipeline for branch push + draft PR update/create.

**Exit criteria**
- End-to-end backend orchestration can execute with mock or live credentials.

### Milestone 4 — Dashboard onboarding and operator views
**Goals**
- Build onboarding flow.
- Build workspace, inbox, repo control, run detail, and approvals views.
- Surface provider/runner health and run timeline artifacts.

**Deliverables**
- Usable dashboard-first operator experience covering vertical slice UI.

**Exit criteria**
- Operator can create and monitor runs from UI without CLI dependence.

### Milestone 5 — Chat-driven autonomy vertical slice completion
**Goals**
- Embed conversational flow and map chat intents to TaskIntent/Plan/Run.
- Execute planner/implementer/validator/reviewer/publisher pipeline.
- Enforce approval gate before publish.

**Deliverables**
- Fully working required vertical slice (live where credentials exist, mock/dry-run otherwise).

**Exit criteria**
- Full timeline and artifact evidence visible in run detail.
- Human approval required before publish action execution.

### Milestone 6 — Telegram quick actions + notification fanout
**Goals**
- Add Telegram bot integration for approve/reject/status.
- Deep-link users back to dashboard run/approval pages.

**Deliverables**
- Telegram secondary control surface behind explicit configuration.

**Exit criteria**
- Quick actions are policy-gated and auditable.

### Milestone 7 — Hardening, QA, docs, and release readiness
**Goals**
- Expand automated tests (unit/integration/UI smoke).
- Implement failure recovery UX and observability improvements.
- Finalize operator/deployment/testing docs and demo data.

**Deliverables**
- Production-readiness package with verified scripts and runbooks.

**Exit criteria**
- End-to-end smoke flow works locally with demo mode.
- Clear live-E2E checklist for GitHub/Codex/Telegram credentials.

## Cross-milestone rules
- No merge/deploy automation.
- No undocumented credential extraction.
- Every external action must produce audit evidence.
- Prefer real boundaries + mock mode where live dependencies are unavailable.
