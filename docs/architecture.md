# Architecture (Bootstrap)

## Monorepo strategy
- Package manager: pnpm workspaces
- Task runner: Turborepo
- Language baseline: strict TypeScript (NodeNext)

## Workspace layout
- apps: web, api, worker
- packages: domain, db, orchestrator, provider-core, provider-codex, github, runners, notifications, policy, shared, ui, cli-admin
- support directories: infra, docs
