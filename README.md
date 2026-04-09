# codex-github-swarm

This repository contains a first backend/domain vertical slice for:
- typed domain entities and lifecycle guardrails
- API orchestration from `TaskIntent -> TaskPlan -> TaskRun`
- policy approval boundary for high-risk actions
- persistent audit trail records

## Quickstart

```bash
pnpm install
pnpm -r build
pnpm --filter @codex-swarm/api start
```

API base URL: `http://localhost:4000`
