# Self-hosting guide

## Topology

Single host deployment via Docker Compose with five services:
- `web`
- `api`
- `worker`
- `db`
- `redis`

## Deploy

```bash
cp .env.example .env
# Fill live credentials where needed
docker compose pull || true
docker compose up -d
```

## Minimum env vars for production hardening

- `NODE_ENV=production`
- `LOG_LEVEL=info`
- `DATABASE_URL`
- `REDIS_URL`
- `GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_WEBHOOK_SECRET`
- `CODEX_MODE=live` (optional; dry-run remains supported)
- `TELEGRAM_BOT_TOKEN`
- `AUDIT_RETENTION_DAYS`
- `POLICY_REQUIRE_HUMAN_APPROVAL=true`
- `PUBLISH_DRY_RUN=true|false`

## Verified locally vs live E2E

### Verified locally
- Compose starts all required services.
- Dry-run smoke flows execute end-to-end without external credentials.

### Requires live E2E credentials
- GitHub OAuth/App and webhook round-trip.
- Live Codex provider sessions.
- Telegram message send/approve deep-links.
