# Demo walkthrough

## Goal

Run a local dry-run demonstration of onboarding → chat intent → approval → publish dry-run.

## Steps

1. Prepare env and install:
   ```bash
   cp .env.example .env
   npm ci
   ```
2. Run quality checks:
   ```bash
   npm run lint && npm run typecheck && npm run test && npm run build
   ```
3. Run smoke walkthrough:
   ```bash
   npm run smoke
   ```
4. Bring up local services:
   ```bash
   docker compose up -d
   ```

## Verified locally

- All scripted dry-run checkpoints above.

## Requires live E2E credentials

- Replace dry-run settings with live credentials:
  - `GITHUB_*`
  - `CODEX_MODE=live`
  - `TELEGRAM_*`
- Execute a real repository publish path and Telegram approval callback.
