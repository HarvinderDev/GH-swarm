# Verification Plan

- `pnpm install`
- `pnpm -r typecheck`
- `pnpm -r build`
- `pnpm --filter @codex-swarm/api start` (smoke boot)

Manual API smoke:
- Submit task intent with high-risk action and verify approval requested.
- Approve request and verify audit records include approval + publish action.
- Query audit endpoint to verify persistent records.
