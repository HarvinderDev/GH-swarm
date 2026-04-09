# Verification Plan

## Verification objectives
- Ensure each milestone is functionally complete and safe before advancing.
- Validate dashboard-first vertical slice behavior and governance guarantees.
- Distinguish local/mock verification from live-E2E verification requiring credentials.

## Standard quality gates (run after each milestone)
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test` (plus targeted integration suites)
- `pnpm build`

If a gate fails, fix before progressing unless explicitly documented with scope-limited rationale.

## Milestone verification gates

### Milestone 0 gate (planning docs)
- Confirm planning documents exist and are internally consistent.
- Confirm explicit mapping of:
  - must-have vs feature-flagged scope,
  - milestones,
  - risk mitigations,
  - live-E2E dependencies.

### Milestone 1 gate (bootstrap)
- Validate monorepo bootstraps and scripts execute.
- Validate local bring-up (at minimum API + web + worker stub).
- Validate CI baseline succeeds for lint/typecheck/tests/build.

### Milestone 2 gate (domain/orchestration core)
- Unit tests for domain lifecycle transitions and policy decisions.
- Integration tests for DB persistence and queue state transitions.
- Recovery tests for interrupted/failed runs.

### Milestone 3 gate (provider + GitHub)
- Contract tests for provider-core compliance.
- Integration tests for Codex adapter in dry-run and available-session modes.
- GitHub service tests for comment/draft-PR publish paths (mocked if credentials absent).
- Verify degraded-mode UX/API when Codex/GitHub credentials are missing.

### Milestone 4 gate (dashboard)
- UI smoke tests for onboarding and workspace/repo/run detail navigation.
- API/UI contract checks for run timeline and approval states.
- Accessibility and basic responsive sanity checks for key pages.

### Milestone 5 gate (vertical slice)
- End-to-end smoke:
  1. onboarding,
  2. repo add,
  3. provider health detect,
  4. chat intent,
  5. task plan/run,
  6. validate/review,
  7. approval,
  8. publish (or dry-run publish path).
- Confirm audit ledger completeness per transition and external action.

### Milestone 6 gate (Telegram)
- Integration tests for approve/reject/status quick actions.
- Deep-link correctness to dashboard run/approval routes.
- Policy checks preventing unauthorized quick actions.

### Milestone 7 gate (hardening)
- Full suite (`lint`, `typecheck`, `test`, `build`, `smoke`).
- Load/resilience sanity checks for queue/worker retry behavior.
- Documentation verification against actual commands and env vars.

## Live-E2E dependency matrix

### GitHub live verification depends on
- GitHub App/OAuth credentials.
- Repository installation and token scopes.
- Network access to GitHub APIs.

**Live-E2E scenarios**
- Create/update draft PR from real branch.
- Post issue comments/status summaries on real repo context.

### Codex live verification depends on
- Codex CLI/session installed and authenticated through official flow.
- Provider session discovery permissions on host.

**Live-E2E scenarios**
- Non-dry-run plan/execute/validate/review cycle using real provider session.

### Telegram live verification depends on
- Telegram bot token and webhook or polling configuration.
- Reachability between bot runtime and Telegram API.

**Live-E2E scenarios**
- Real approve/reject/status actions from Telegram with dashboard deep links.

## Local/mock verification fallback
When live credentials are unavailable:
- Use dry-run providers and mocked GitHub/Telegram adapters.
- Keep orchestration, policy, and audit code paths real.
- Record unverified-live scenarios in release notes and docs with exact setup steps.

## Latest verification run (2026-04-09)

- `pnpm lint`: pass
- `pnpm typecheck`: pass
- `pnpm test`: pass
- `pnpm build`: pass
- `pnpm smoke`: pass
