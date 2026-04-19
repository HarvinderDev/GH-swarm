# Current State (as of 2026-04-14)

## Repository and runtime baseline

This repository currently implements a **working vertical slice** with three runnable apps (`apps/web`, `apps/api`, `apps/worker`) and core packages (`domain`, `orchestrator`, `provider-core`, `provider-codex`, `github`, `policy`, `db`, `shared`).

What exists in code today:
- API: Fastify service with minimal endpoints for workspace/repo creation, intent execution, approval, provider health, and state dump.
- Orchestrator: in-process `TaskIntent -> TaskPlan -> TaskRun` sequence with timeline/artifact generation and a publish call path.
- Provider abstraction: `provider-core` interface plus `provider-codex` implementation with dry-run support.
- Publish boundary: `packages/github` exposes dry-run-by-default draft PR operation.
- Policy boundary: publish policy prevents merge/deploy automation and requires approval semantics.
- Web: Fastify-served HTML shell with a basic form that calls API endpoints.
- Worker: scheduler stub that pings provider health.

## What is scaffolded but shallow

The following are present but mostly baseline-level:
- `packages/db`: schema SQL and migration file exist, but API/orchestrator runtime state is still in-memory and not persisted through repository abstractions.
- `apps/worker`: periodic health-check loop exists, but there is no queue-backed execution or durable claim/retry model.
- `packages/ui`, `packages/cli-admin`: package shells with very limited behavior.

## What docs describe but code does not yet implement

Documented architecture targets PostgreSQL + Redis-backed durability, queue workers, richer policy/audit ledger, and a real dashboard application. In current code:
- No durable queue processing path is wired.
- No DB-backed repositories are used by control-plane state transitions.
- No real GitHub live publish integration (dry-run only placeholder for live).
- Web is not the documented dashboard-grade experience (it is a lightweight HTML shell).
- Notifications/Telegram/runners packages expected in docs are not active implementations in this branch.

## Main architectural mismatches

1. **Durability mismatch**: docs imply durable control-plane state, while current API runtime state is memory-resident.
2. **Execution-plane mismatch**: docs imply async queue-backed workers, while current run flow executes synchronously inside API request path.
3. **UX mismatch**: docs imply dashboard-first app with multiple operator views, while current web app is a single-page form shell.
4. **Integration mismatch**: docs imply production-safe publish integration depth; current implementation intentionally remains dry-run-centric.
5. **Audit depth mismatch**: run timeline/artifacts exist, but immutable audit trails and policy decision records are not yet fully separated/persisted.

## Open PR posture relative to this branch

GitHub shows PR #8 and PR #9 merged into `main`. This working branch snapshot does not yet contain PR #9 hardening changes, so first incremental stabilization should align this branch with #9-equivalent safety improvements before broader refactors.
