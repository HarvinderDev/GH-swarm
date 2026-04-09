# codex-github-swarm

Self-hosted, dashboard-first conversational AI engineering manager for GitHub repositories.

## What this change adds

- CI workflow for `lint`, `typecheck`, `test`, and `build`.
- Smoke scripts for:
  - onboarding
  - chat intent flow
  - approval flow
  - publish dry-run flow
- `docker-compose.yml` for local bring-up of:
  - web
  - api
  - worker
  - db (PostgreSQL)
  - redis
- Expanded operational documentation across `docs/` with exact env vars and verification boundaries.

## Quickstart

```bash
cp .env.example .env
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run smoke
docker compose up -d
```

## Exact environment variables

See `.env.example` for the canonical list. Required/expected keys:

- Runtime: `NODE_ENV`, `LOG_LEVEL`
- Ports: `WEB_PORT`, `API_PORT`
- Smoke bootstrap: `WORKSPACE_NAME`, `DEFAULT_REPO_URL`, `SMOKE_CHAT_INTENT`, `APPROVER_HANDLE`
- Worker runtime: `WORKER_CONCURRENCY`, `TASK_POLL_INTERVAL_MS`
- Data plane: `DATABASE_URL`, `REDIS_URL`
- GitHub: `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET`, `GITHUB_OWNER`, `GITHUB_REPO`
- Codex provider: `CODEX_MODE`, `CODEX_CLI_PATH`, `CODEX_SESSION_STRATEGY`
- Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Governance/audit: `AUDIT_RETENTION_DAYS`, `POLICY_REQUIRE_HUMAN_APPROVAL`, `PUBLISH_DRY_RUN`

## Verified locally vs live E2E

### Verified locally

- Structural lint/type/build checks.
- Smoke flows for onboarding/chat intent/approval/publish dry-run.
- Docker Compose service topology for web/api/worker/db/redis startup.

### Requires live E2E credentials

- GitHub App auth, webhook receipt, and draft PR mutations.
- Codex CLI authenticated session reuse against a real provider session.
- Telegram bot delivery and callback action handling.

See `docs/testing.md` and `docs/demo-walkthrough.md` for step-by-step verification plans.
