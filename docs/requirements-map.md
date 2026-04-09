# Requirements Map

## Scope for this milestone

Implement provider abstraction and first Codex provider adapter for:

- `healthCheck`, `listSessions`, `acquireSession`
- `planTask`, `executeTask`, `validateTask`, `reviewTask`, `summarizeTask`, `parseIntent`
- `supportsRemoteExecution`

## Constraints

- Prefer official/local CLI and session reuse.
- No cookie scraping or undocumented auth extraction.
- Graceful degraded mode when Codex is unavailable.
- Dry-run/demo mode for local verification without credentials.
