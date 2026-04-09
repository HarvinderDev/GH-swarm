# Implementation plan (current milestone)

1. Add repository-level scripts for lint/typecheck/test/build checks.
2. Add smoke scripts covering onboarding, chat intent, approval, publish dry-run.
3. Add GitHub Actions CI workflow invoking required checks.
4. Add Docker Compose local topology with web/api/worker/db/redis.
5. Document local dev, self-hosting, testing, and integrations with exact env vars.
6. Classify verified-local vs requires-live-E2E for each integration area.
