# Requirements Map: apps/web vertical slice

## Requested scope
- Next.js App Router in `apps/web`.
- Core pages:
  - onboarding
  - workspace dashboard + repo control
  - embedded chat to submit `TaskIntent`
  - run detail timeline (plan/execution/validation/review artifacts)
  - approval UI (approve/reject/request changes)
- UI must be wired to API endpoints.
- UI must clearly show degraded/mock behavior when live integrations are missing.

## Must-build now
- Render all requested pages with API-driven data loading.
- Implement endpoints for onboarding, workspace/repo views, task-intent submission, run detail, and approvals.
- Expose explicit integration state badges/messages and degraded-path callouts.

## Deferred
- Real auth handshakes and persistent storage.
- Live GitHub and provider sessions beyond env-driven mode toggles.
