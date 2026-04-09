# Provider: Codex

## Provider env vars

- `CODEX_MODE` (`dry-run` or `live`)
- `CODEX_CLI_PATH` (default `codex`)
- `CODEX_SESSION_STRATEGY` (default `cli-reuse`)

## Local verification

Use dry-run mode:

```bash
CODEX_MODE=dry-run npm run smoke:chat-intent
```

This validates intent-to-plan orchestration without requiring an authenticated live provider session.

## Live E2E requirements

- Codex CLI installed and available at `CODEX_CLI_PATH`.
- Authenticated local CLI session using official flows.
- `CODEX_MODE=live`.

## Verified locally vs live E2E

### Verified locally
- Dry-run provider path used by smoke scripts.

### Requires live E2E credentials
- Real model execution, session acquisition/reuse, and provider health against live services.
