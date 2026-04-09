# Verification Plan: apps/web vertical slice

## Commands
- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

## Manual checks
- Open `/onboarding` and verify integration state badges are visible.
- Open `/workspace` and `/workspace/acme-web`.
- Submit chat on `/chat` and verify TaskIntent accepted.
- Open `/runs/run_1001` and validate degraded banner appears if env not live.
- Open `/approvals` and execute approval actions.
