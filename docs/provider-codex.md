# Provider Codex

`packages/provider-core` defines provider contracts.

`packages/provider-codex` implements:
- health check via `codex --version` when not in dry-run
- session listing/acquire
- plan/execute/validate/review/summarize methods

Use `CODEX_DRY_RUN=true` for local deterministic runs.
