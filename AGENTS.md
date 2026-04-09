# AGENTS.md

## Project mission

Build this repository into `codex-github-swarm`, a self-hosted conversational AI engineering manager for GitHub repositories.

The product specification lives in `PLAN.md`.
Treat `PLAN.md` as the source of truth for product scope, constraints, priorities, and acceptance direction.

If guidance in this file and `PLAN.md` differ:
1. prefer `PLAN.md` for product requirements
2. prefer this file for execution discipline and repository workflow

## Working mode

- Always read `PLAN.md` before major work.
- Do not jump straight into coding on large tasks.
- For non-trivial work, first inspect the repo state, identify gaps, and create/update a written implementation plan in `docs/`.
- Prefer a working vertical slice before broadening scope.
- Primary UX is dashboard + chat. Do not drift into a CLI-first product.
- CLI is admin/debug/fallback only.

## Required planning behavior

For any substantial feature, architecture change, or repo bootstrap:
- create or update:
  - `docs/requirements-map.md`
  - `docs/architecture.md`
  - `docs/implementation-plan.md`
  - `docs/verification-plan.md`
- break work into milestones
- execute milestone by milestone
- verify after each milestone before moving on

If the user asks for a major build from scratch:
- plan first
- then implement
- then verify
- then summarize what is complete vs what still needs live E2E validation

## Subagent policy

Use subagents explicitly for large work.

When a task is substantial, spawn parallel subagents for:
- requirements analysis
- architecture
- backend/domain design
- frontend/product design
- integrations
- QA/release planning

Wait for all requested subagents to finish, then synthesize the outputs into one practical implementation plan before coding.

Keep the main thread focused on decisions, plan, and final outputs.
Use subagents to reduce context pollution from exploration, logs, and partial analyses.

## Product rules

- Dashboard + embedded chat is the primary operator interface.
- Telegram is a secondary quick-action surface.
- Multi-repo workspace support is required.
- Codex is first-class, but provider behavior must go through an adapter boundary.
- Prefer official/documented auth flows and installed CLI/session reuse.
- Do not implement credential scraping, browser cookie extraction, or undocumented auth hacks.
- AI may plan, code, test, push branches, open/update draft PRs, and post issue updates when allowed by policy.
- Merge and deploy must remain human-gated.
- All external actions must be auditable and tied to artifacts/evidence.

## Engineering rules

- Use strong typing and explicit contracts.
- Prefer maintainable code over clever abstractions.
- Keep modules cohesive.
- Avoid placeholder-only implementations when a real local implementation is possible.
- If a live external integration cannot be fully exercised in the environment, implement the real boundary plus dry-run/mock mode and document what remains to be live-verified.

## Repository structure expectations

Prefer a monorepo with clear separation between:
- web/dashboard
- api/control plane
- worker/scheduler
- domain
- db
- provider-core
- provider-codex
- github integration
- runners
- policy/audit
- notifications
- shared/ui
- admin/debug CLI

If the repo is blank, scaffold the project accordingly.
If the repo is partially scaffolded, preserve good foundations and refactor weak structure rather than rebuilding blindly.

## Verification rules

After each major milestone, run the relevant verification commands.
Prefer these standard scripts where available:

- install
- dev
- build
- lint
- typecheck
- test
- smoke
- seed/demo

Before considering a milestone complete:
- lint passes
- typecheck passes
- relevant tests pass
- build passes
- failures are fixed or explicitly documented

## Documentation rules

Keep docs updated as the code evolves.

By the time a major feature lands, the repo should contain updated:
- `README.md`
- `docs/local-dev.md`
- `docs/self-hosting.md`
- `docs/testing.md`

For provider/integration work, also maintain:
- `docs/provider-codex.md`
- `docs/github-integration.md`
- `docs/telegram.md`
- `docs/policy-and-audit.md`

## ExecPlan / Plan document rule

`PLAN.md` is the long-horizon product plan for this repository.

Use `PLAN.md`:
- before any major architecture or implementation decision
- when deciding feature priority
- when resolving scope questions
- when choosing between breadth and vertical-slice completion

Do not treat `PLAN.md` as a static artifact only; keep implementation aligned with it.
If implementation reveals a necessary change in approach, document the decision in `docs/architecture.md` or `docs/risk-register.md` rather than silently drifting.

## Completion behavior

When finishing a work session:
- summarize what changed
- summarize what was verified
- call out what still needs live credentials or live E2E validation
- give exact next commands or next engineering steps
