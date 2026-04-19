# Target Architecture (incremental, production-oriented)

## Principles
- Keep monorepo and existing package boundaries.
- Preserve dry-run-safe defaults and human-gated publish.
- Favor contract-first refactors over rewrites.
- Move runtime from in-memory to durable services in staged steps.

## Service responsibilities

### `apps/web`
- Primary operator dashboard and embedded chat UX.
- Render workspace/repo/run/approval views.
- Consume API contracts only; no orchestration side effects directly.

### `apps/api`
- Control-plane HTTP boundary.
- Input validation, auth/policy checks, and command/query orchestration.
- Persist intent/plan/run/approval records via repository interfaces.
- Emit queue jobs for async execution.

### `apps/worker`
- Queue consumers for plan/run/validate/review/publish steps.
- Retry, backoff, dead-letter behavior.
- Scheduled scans and maintenance jobs.

### `packages/domain`
- Core entities, lifecycle states, state transition constraints, and typed contracts.

### `packages/orchestrator`
- Application orchestration service over domain + repositories + queue contracts.
- Handles TaskIntent -> TaskPlan -> TaskRun lifecycle with explicit transition rules.

### `packages/provider-core`
- Provider adapter contract, capability flags, and normalized result/error envelopes.

### `packages/provider-codex`
- Codex implementation via official CLI/session reuse and dry-run fallback.

### `packages/github`
- GitHub publish/comment/status boundary.
- Dry-run mode + live Octokit-backed implementation behind same contract.

### `packages/db` (or persistence layer)
- DB schema, migrations, repositories for domain entities.
- Transaction boundaries for lifecycle transition consistency.

### `packages/policy` and audit/artifact/queue layers
- `policy`: allow/deny + approval requirements for task/action categories.
- `audit` (new package recommended): append-only event ledger and actor/action evidence.
- `artifacts` (new package recommended): durable run artifacts metadata + storage pointers.
- `queue` (new package recommended): queue producer/consumer contracts to isolate vendor wiring.

## Runtime topology target
- API + Worker as separate processes.
- PostgreSQL for state.
- Redis-backed queue for async execution.
- Optional object storage for artifacts.
- Web as dashboard-first front end consuming API events/state.
