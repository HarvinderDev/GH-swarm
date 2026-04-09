# Implementation Plan (Current Slice)

## Milestone 1 — Shared contracts
- Add `packages/shared/src/audit.ts` and `config.ts`.
- Define stable, strongly typed audit artifact schema.

## Milestone 2 — GitHub integration package
- Add live + mock implementations.
- Cover requested operations: context ingest, draft PR create/update, status comments.
- Emit audit artifacts in both success and failure branches.

## Milestone 3 — Runner package
- Add local and remote runner implementations.
- Add router with policy-driven selection.
- Add dry-run alternatives with evidence pointers.

## Milestone 4 — Notifications package
- Add in-app adapter.
- Add Telegram adapter with env-gated live mode.
- Add service fanout and audit emission.

## Milestone 5 — Verification and docs
- Add unit tests for audit guarantees and routing behavior.
- Run typecheck + tests.
- Update README and docs for setup and limitations.
