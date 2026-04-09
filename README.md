# codex-github-swarm

Dashboard-first self-hosted orchestration surface for GitHub engineering automation.

## Current implemented slice
This repository now includes a runnable `apps/web` Next.js App Router UI with:
- onboarding (GitHub + provider state/discovery)
- workspace dashboard and repo control views
- embedded chat to submit `TaskIntent`
- run detail timeline with artifacts
- approvals queue with approve/reject/request-changes actions

Each page is wired to local API endpoints and shows degraded/mock states when live integrations are unavailable.

## Quickstart
```bash
pnpm install
pnpm --filter web dev
```

Then visit:
- `http://localhost:3000/onboarding`
- `http://localhost:3000/workspace`
- `http://localhost:3000/chat`
- `http://localhost:3000/runs/run_1001`
- `http://localhost:3000/approvals`

## Integration mode toggles
Use env variables to switch out of degraded/mock mode:
- `GITHUB_INTEGRATION_MODE=live`
- `PROVIDER_MODE=live`
