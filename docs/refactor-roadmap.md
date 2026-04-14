# Refactor Roadmap (staged, reviewable)

## PR triage status (as of 2026-04-14)

- **PR #9** (`Harden API validation, approval transitions, and publish target resolution`): already merged on GitHub `main`; apply equivalent changes on stale branches if missing.
- **PR #7** (`Next.js App Router web vertical slice`): superseded by merged baseline trajectory; salvage UI route/component ideas only after API contracts stabilize.
- **PR #6** (`provider-core + provider-codex`): largely superseded by merged baseline and later updates; salvage only any missing test or docs deltas.
- **PR #5** (`domain lifecycle + orchestration API`): superseded by merged vertical-slice baseline; salvage isolated validation/state-transition ideas only.
- **PR #4/#3/#2**: largely superseded by merged baseline PR #8 and subsequent merged hardening #9; close as superseded unless a specific commit contains a still-missing atomic improvement.

## Stage 1 — Baseline stabilization

1. Land PR #9-equivalent hardening where absent:
   - API input validation schemas + consistent error responses.
   - Orchestrator validation of workspace/repo relations and idempotent approval handling.
   - Durable local runtime-store persistence (file-backed) as transitional durability.
2. Add focused tests for validation/approval edge cases.
3. Keep dry-run defaults unchanged.

## Stage 2 — Control-plane hardening

1. Extract API route handlers from bootstrap.
2. Introduce typed request/response DTOs and error codes.
3. Move policy evaluation to explicit service boundaries and record policy decisions on run timeline.

## Stage 3 — Persistence and queue architecture

1. Introduce repository interfaces in orchestrator.
2. Implement DB-backed repositories in `packages/db`.
3. Introduce queue abstraction + Redis-backed adapter.
4. Switch API `runIntent` to enqueue execution and return run handle.

## Stage 4 — Orchestrator refactor

1. Split synchronous run flow into explicit lifecycle commands/events.
2. Add worker-driven state transitions with retry-safe idempotency.
3. Add compensation/recovery semantics for partial failures.

## Stage 5 — Real dashboard/web alignment

1. Replace Fastify HTML shell with real dashboard app (likely Next.js).
2. Implement workspace list, repo detail, run detail, approvals views.
3. Integrate polling/SSE for run lifecycle updates.

## Stage 6 — Publish and audit hardening

1. Implement append-only audit service package.
2. Harden GitHub live publish with explicit branch/PR metadata and failure classification.
3. Add immutable approval evidence linking actor, reason, timestamp, and resulting publish operation.

## Deferred follow-ups (not in first-step scope)

- Telegram quick actions and notification fanout.
- Remote runner routing and workload classes.
- Provider session acquisition beyond local default simulation.
- End-to-end live integration verification with real GitHub/Codex credentials.
