# Implementation Plan: apps/web vertical slice

## Milestone 1: Bootstrap web app
- Create root workspace and turbo config.
- Scaffold `apps/web` with Next.js App Router and TypeScript.

## Milestone 2: API contracts and endpoints
- Define domain types.
- Add mock/degraded-aware data model.
- Implement route handlers for onboarding, workspace, repo control, task intents, runs, and approvals.

## Milestone 3: UI pages
- Build onboarding page.
- Build workspace dashboard and repo control.
- Build chat intent submit surface.
- Build run detail timeline page.
- Build approval queue with actions.

## Milestone 4: Verify
- Run install, lint, typecheck, build.
