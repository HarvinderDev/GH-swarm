# Requirements Map (Integration Slice)

## Requested scope
- Implement `packages/github` for issue/PR context ingestion, draft PR create/update, and status comments.
- Implement `packages/runners` for local + remote runners with routing policy.
- Implement `packages/notifications` for in-app + Telegram adapters.
- Ensure every external action emits audit artifacts: actor, intent, payload summary, result, evidence pointers.
- Provide config-gated live paths with mock/dry-run alternatives when credentials are missing.

## Must-build now
- Typed interfaces + implementation for each package.
- Shared audit artifact contract and sink.
- Runtime config loader from env.
- Unit tests demonstrating audit emission and routing/mode behavior.

## Feature-flagged or env-gated
- Live GitHub API calls (requires `GITHUB_TOKEN` + `GITHUB_LIVE_ENABLED=true`).
- Live remote runner calls (requires remote endpoint/token + enable flag).
- Live Telegram sending (requires bot token/chat id + enable flag).
