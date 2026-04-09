# Requirements Map

## Requested scope
- Implement domain entities in `packages/domain` using explicit contracts (Zod + TypeScript).
- Implement lifecycle states and transition guards covering `discovered` through `archived`.
- Implement API routes in `apps/api` for repo/provider/task/approval/audit operations.
- Implement orchestration from `TaskIntent -> TaskPlan -> TaskRun`.
- Implement policy decision boundary for high-risk actions.
- Persist audit records for external actions and approvals.
- Keep merge/deploy actions human-gated.

## Acceptance checks
1. Domain exports strongly typed entities and validators.
2. Task state transitions are validated by explicit guard logic.
3. API includes CRUD-style task/repo/provider endpoints and approval/audit flows.
4. Orchestration endpoint creates plan + run records from intent submission.
5. Any high-risk action (merge/deploy/secrets/destructive/prod-infra) requires approval request.
6. Audit records are persisted and queryable.
