# Implementation Plan

## Milestone 1: Domain contracts
- Add lifecycle state enum and transition guard map.
- Add all requested entities with Zod schemas and inferred TS types.
- Add policy and audit schemas.

## Milestone 2: API + orchestration
- Scaffold Fastify API.
- Add repositories/services for repo/provider/task/approval/audit.
- Add orchestration service for intent -> plan -> run.

## Milestone 3: Policy + persistence
- Add policy evaluation boundary for high-risk actions.
- Add persistent audit and approval storage.
- Enforce human-gated merge/deploy.

## Milestone 4: verification
- Run install, typecheck, and build.
- Confirm server boots.
