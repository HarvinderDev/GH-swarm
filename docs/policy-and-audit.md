# Policy and audit

## Policy controls via env vars

- `POLICY_REQUIRE_HUMAN_APPROVAL=true`
- `PUBLISH_DRY_RUN=true|false`
- `AUDIT_RETENTION_DAYS=<number>`

## Required policy behavior

- Merge/deploy remains human gated.
- Publish defaults to dry-run unless explicitly configured otherwise.
- Approval flow records an audit event.

## Local verification

```bash
npm run smoke:approval
npm run smoke:publish-dry-run
```

## Verified locally vs live E2E

### Verified locally
- Approval gate and publish dry-run smoke scenarios enforce policy expectations.

### Requires live E2E credentials
- External-system action logs that include GitHub and Telegram round-trip evidence.
