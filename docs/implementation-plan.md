# Implementation Plan

## Milestone 1: Provider contract

- Create `@codex-github-swarm/provider-core` package.
- Define strong typed interface methods and payloads.

## Milestone 2: Codex provider adapter

- Create `@codex-github-swarm/provider-codex` package.
- Implement CLI probing, session listing/acquisition, and role-based task methods.
- Add degraded and dry-run/demo behavior.

## Milestone 3: Verification

- Run typecheck and build across workspaces.
- Document provider behavior and local usage.
