# Verification Plan (Integration Slice)

## Static checks
- `pnpm typecheck`
- `pnpm build`

## Behavioral checks
- `pnpm test`
- Focus assertions:
  - GitHub mock path emits auditable events with evidence pointers.
  - Runner router chooses remote/local correctly.
  - Runner dry-run path produces artifacts and simulated output.
  - Notification fanout emits both in-app and Telegram artifacts.

## Live verification deferred
- Live GitHub operations
- Live remote runner endpoint calls
- Live Telegram sends

These require real credentials/infrastructure and should be run in a configured self-hosted environment.
