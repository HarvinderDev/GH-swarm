# codex-github-swarm

Integration slice implementing:

- `packages/github` for issue/PR ingestion + draft PR flows + status comments.
- `packages/runners` for local/remote execution with routing policy.
- `packages/notifications` for in-app + Telegram fanout.
- Shared audit artifacts for every external action.

## Quickstart

```bash
pnpm install
pnpm typecheck
pnpm test
```

## Environment variables

See `.env.example` for all integration gates.

## Packages

- `packages/shared`: audit schema and configuration loader.
- `packages/github`: live/mock GitHub adapter.
- `packages/runners`: local + remote runner abstractions and router.
- `packages/notifications`: in-app + Telegram adapters.
