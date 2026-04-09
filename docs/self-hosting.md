# Self-hosting

Use `docker-compose.yml` for local self-hosted bring-up. Set real values in `.env` for production-like runs.

Live integrations requiring credentials:
- Codex CLI session (`CODEX_DRY_RUN=false` + authenticated CLI).
- GitHub credentials (`GITHUB_DRY_RUN=false` + Octokit wiring and token scopes).
