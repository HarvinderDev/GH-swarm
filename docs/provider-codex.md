# Provider: Codex

## Behavior

`CodexProvider` implements `ProviderAdapter` from `provider-core`.

Modes:

- **live**: attempts `codex` command execution
- **degraded**: CLI unavailable/failing; safe fallback responses
- **dry-run/demo**: deterministic outputs without live credentials

## Auth and session model

- Session discovery via `codex sessions list --json`.
- Optional session creation via `codex sessions create --json` when requested.
- No cookie scraping, browser extraction, or undocumented auth hacks.

## Local verification

Use dry-run/demo mode:

```ts
import { createCodexProvider } from "@codex-github-swarm/provider-codex";

const provider = createCodexProvider({ dryRun: true, demoMode: true });
```
