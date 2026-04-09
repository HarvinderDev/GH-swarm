# codex-github-swarm

Self-hosted dashboard-first conversational AI engineering manager for GitHub repositories.

## Vertical slice included
- Web dashboard boot with embedded chat-trigger form.
- API control plane boot with TaskIntent -> TaskPlan -> TaskRun pipeline.
- Worker scheduler boot with provider health checks.
- DB schema + SQL migration files.
- Provider adapter boundary (`provider-core`) + Codex implementation (`provider-codex`).
- Multi-repo workspace creation.
- Run timeline/artifacts + approval gate.
- Draft PR publish flow with dry-run default.

## Quick start
```bash
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

Open http://localhost:3000.

## Verify
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
```

## Docker
```bash
docker compose up --build
```
