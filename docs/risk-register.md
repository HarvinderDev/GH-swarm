# Risk Register

## Method
Risks are tied to architectural decisions and tracked with concrete mitigations and verification hooks.

## Risks, impact, and mitigations

### R1 — Provider lock-in and brittle Codex coupling
- **Architecture decision link:** provider-core adapter boundary with capability flags.
- **Impact if unmitigated:** difficult future provider expansion, widespread refactors, unstable abstractions.
- **Mitigation:** enforce contract-first provider API in `packages/provider-core`; isolate Codex specifics in `packages/provider-codex`.
- **Verification:** provider contract tests for required methods and capability reporting.

### R2 — Auth/credential handling violating security constraints
- **Architecture decision link:** official auth and CLI/session reuse only; no scraping.
- **Impact if unmitigated:** security/privacy breach, policy non-compliance, unsafe secret handling.
- **Mitigation:** ban undocumented auth paths in code review/tests; support explicit env secrets and official flows only.
- **Verification:** static checks and integration tests that fail on prohibited auth mechanisms.

### R3 — Unrecoverable orchestration state after worker/API interruptions
- **Architecture decision link:** queue-backed orchestration + persisted TaskRun lifecycle.
- **Impact if unmitigated:** lost tasks, orphaned runs, operator distrust.
- **Mitigation:** persist transition checkpoints, idempotent worker handlers, retry/backoff strategy, failed/blocked terminal states.
- **Verification:** interruption/restart integration tests and state-recovery smoke scenarios.

### R4 — Unsafe autonomy actions bypassing human gates
- **Architecture decision link:** policy engine + explicit approval workflow.
- **Impact if unmitigated:** unauthorized publish/merge/deploy behavior and high operational risk.
- **Mitigation:** hard-stop action categories enforced in policy layer; publish steps require approval tokens.
- **Verification:** policy tests covering forbidden actions and approval-required flows.

### R5 — Poor observability and missing audit evidence
- **Architecture decision link:** centralized audit/artifact persistence for every external action.
- **Impact if unmitigated:** inability to explain decisions/actions; compliance and debugging failures.
- **Mitigation:** mandatory audit event emission on state transitions and external integration calls.
- **Verification:** integration assertions for audit completeness in vertical-slice smoke tests.

### R6 — Dashboard UX drift toward CLI-first behavior
- **Architecture decision link:** dashboard-first operator experience.
- **Impact if unmitigated:** product deviates from core mission and adoption suffers.
- **Mitigation:** treat CLI as wrapper-only for admin/debug; enforce feature parity priority in web flows.
- **Verification:** milestone acceptance requires end-to-end dashboard execution without CLI dependence.

### R7 — Remote runner complexity delaying core value delivery
- **Architecture decision link:** vertical-slice-first strategy with staged remote runner depth.
- **Impact if unmitigated:** prolonged delivery, partial system without usable core flow.
- **Mitigation:** ship local runner vertical slice first; keep remote runner behind explicit interface and staged rollout.
- **Verification:** milestone ordering and release gates prioritize local vertical slice completion.

### R8 — Integration fragility when live credentials are absent in dev/CI
- **Architecture decision link:** real boundaries plus dry-run/mock modes.
- **Impact if unmitigated:** blocked development, untestable flows, brittle release readiness.
- **Mitigation:** implement mock adapters for GitHub/Codex/Telegram while preserving real orchestration/policy/audit paths.
- **Verification:** smoke tests in credential-less mode and separate live-E2E checklist.

## Ongoing risk review cadence
- Reassess this register at each milestone exit.
- Add new risks when architecture or integration strategy changes.
- Link mitigations to test cases and documentation updates before release sign-off.
