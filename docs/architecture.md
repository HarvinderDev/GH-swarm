# Architecture Notes

## Provider boundary

`packages/provider-core` defines a strict `ProviderAdapter` interface for orchestration roles and provider session lifecycle.

`packages/provider-codex` implements this interface with a CLI-backed adapter (`CodexProvider`) that shells out to the official/local `codex` CLI.

## Runtime behavior

- **Live mode**: runs `codex` CLI commands and parses output.
- **Degraded mode**: if CLI is unavailable/failing, returns non-throwing fallback outputs and degraded health.
- **Dry-run/demo mode**: deterministic local responses for developer verification without credentials.

## Security posture

- Authentication follows local CLI/session reuse.
- No browser credential scraping, cookie extraction, or undocumented auth methods.
