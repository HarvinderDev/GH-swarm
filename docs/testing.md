# Testing

## CI scope

The CI workflow runs:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run build`

## Smoke test scripts

- `npm run smoke:onboarding`
- `npm run smoke:chat-intent`
- `npm run smoke:approval`
- `npm run smoke:publish-dry-run`
- `npm run smoke` (all)

## Local execution

```bash
cp .env.example .env
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run smoke
```

## Verified locally

- All quality commands above pass in dry-run mode.
- Smoke scripts validate onboarding, chat intent orchestration, approval gate behavior, and publish dry-run safeguards.

## Requires live E2E credentials

- GitHub branch push + draft PR creation in a real repository.
- Live Codex provider execution with authenticated CLI/session.
- Telegram bot approval actions and deep-link callbacks.
