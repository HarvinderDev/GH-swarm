# GitHub integration

## Environment variables

- `GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_WEBHOOK_SECRET`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `PUBLISH_DRY_RUN`

## Publish safety

- Keep `PUBLISH_DRY_RUN=true` for local testing.
- Human approval is required before any non-dry-run publish action.

## Local verification

```bash
PUBLISH_DRY_RUN=true npm run smoke:publish-dry-run
```

## Live E2E requirements

- Valid GitHub App installed on target org/repo.
- Webhook endpoint reachable from GitHub.
- Permission scopes for branch push and draft PR creation.

## Verified locally vs live E2E

### Verified locally
- Dry-run publish path prevents live mutation and still produces publish artifacts.

### Requires live E2E credentials
- Branch creation, push, PR creation/update, and webhook-driven status synchronization.
