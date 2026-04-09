# Self-hosting Notes

This milestone introduces provider packages only.

For Codex provider in production-like setup:

1. Install official `codex` CLI on host.
2. Authenticate via documented CLI flow.
3. Configure control plane to instantiate `CodexProvider` with default (live) mode.
4. Keep dry-run mode available for health fallback and local demos.
