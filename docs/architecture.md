# Architecture (Current Slice)

## Components
- `packages/domain`: Core schema/contracts, lifecycle guards, policy and audit contracts.
- `apps/api`: Fastify control-plane API with file-backed persistence and orchestration service.

## Data model
- In-memory stores for live process data.
- Durable append-only JSONL audit log at `apps/api/data/audit-log.jsonl`.
- Durable JSON snapshot for approvals at `apps/api/data/approvals.json`.

## Control flow
1. Client submits task intent.
2. Orchestrator parses intent, creates task plan, creates task run.
3. Policy engine evaluates planned actions.
4. High-risk actions create `ApprovalRequest` and transition run to `awaiting_approval`.
5. Low-risk actions execute immediately and produce `PublishRecord` + `Artifact` + `AuditRecord`.
6. Approval route decides approval and resumes publish path.

## Safety boundary
- Merge/deploy are hard-coded human-gated even if policy allows auto-run.
