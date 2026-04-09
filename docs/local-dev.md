# Local development

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose v2

## Setup

```bash
cp .env.example .env
npm ci
```

## Development checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run smoke
```

## Bring up local runtime

```bash
docker compose up -d
```

Services:
- web: `http://localhost:${WEB_PORT:-3000}`
- api: `http://localhost:${API_PORT:-4000}`
- db: `localhost:5432`
- redis: `localhost:6379`

## Environment variables

Use all keys from `.env.example` exactly as listed.

## Verification boundary

### Verified locally
- Scripted lint/typecheck/test/build tasks.
- Smoke flows in dry-run mode.
- Compose startup for web/api/worker/db/redis.

### Requires live E2E credentials
- GitHub app publish operations.
- Codex authenticated non-dry-run execution.
- Telegram quick-action flows.
