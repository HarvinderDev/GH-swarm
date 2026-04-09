# codex-github-swarm

Bootstrap monorepo scaffold for a dashboard-first, self-hosted GitHub AI engineering manager.

## Workspace layout

- `apps/web`
- `apps/api`
- `apps/worker`
- `packages/domain`
- `packages/db`
- `packages/orchestrator`
- `packages/provider-core`
- `packages/provider-codex`
- `packages/github`
- `packages/runners`
- `packages/notifications`
- `packages/policy`
- `packages/shared`
- `packages/ui`
- `packages/cli-admin`
- `infra/`
- `docs/`

## Root scripts

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm smoke`
- `pnpm run seed/demo`

## Notes

This phase establishes strict TypeScript compilation, linting, formatting, and test baselines across all workspaces.
