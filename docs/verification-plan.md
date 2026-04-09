# Verification plan (current milestone)

## Commands

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run smoke`

## Expected outcomes

- All commands exit 0 in dry-run/local mode.
- Smoke scripts prove the intended sequence:
  onboarding -> chat intent -> approval -> publish dry-run.
- Docker Compose config includes web/api/worker/db/redis services.
