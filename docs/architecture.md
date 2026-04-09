# Architecture: web vertical slice

## Stack
- Monorepo root with pnpm workspaces + turbo.
- `apps/web`: Next.js App Router + TypeScript.

## Runtime shape
- Pages are client-rendered for interactive controls and API calls.
- API routes are colocated under `apps/web/app/api/*` for this slice.
- Mock/degraded/live behavior controlled via env:
  - `GITHUB_INTEGRATION_MODE=live`
  - `PROVIDER_MODE=live`

## Contracts
- Typed contracts live in `apps/web/lib/types.ts`.
- In-memory mock data + state mutation in `apps/web/lib/mock-data.ts`.

## Degraded mode behavior
- Onboarding and run detail pages explicitly render degraded/mock state and action prompts.
- Approvals and chat still function against mock API endpoints.
