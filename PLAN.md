You are Codex acting as the principal engineer, architect, product engineer, backend lead, frontend lead, DevOps engineer, QA lead, and technical writer for this repository.

Your mission:
Build a production-grade first version of `codex-github-swarm` from scratch in this repository.

This repo may be blank. If it is blank, scaffold everything from zero.

Treat `PLAN.md` in the repository root as the primary source of truth.
If any requirement in this prompt conflicts with PLAN.md, prefer PLAN.md.
If PLAN.md leaves a gap, make concrete, high-quality defaults, document them, and keep going.

High-level product goal:
Build a self-hosted, dashboard-first, conversational AI engineering manager for GitHub repositories.

It must support:
- dashboard + embedded chat as the main operator surface
- Telegram as a secondary quick-action surface
- multi-repo workspace support
- local runners and remote runners
- near-full autonomy for plan/code/test/push/open draft PR/comment
- explicit human-gated merge/deploy
- strong auditability, policy enforcement, and recoverable task states
- CLI only as admin/debug/fallback, not the primary UX

Non-negotiable product requirements:
1. Primary surface is web dashboard + chat, not terminal-first.
2. Self-hosted first.
3. Multi-repo workspace capable.
4. Codex is the first-class provider, but the architecture must use a provider adapter contract, not Codex-specific hardcoding everywhere.
5. Common provider auth path must prefer installed CLI/session reuse and official auth flows. Do not require raw API key entry for the common Codex path.
6. Never scrape browser cookies or raw secrets directly. Do not implement anything that extracts undocumented browser credentials. Use official CLI presence, documented auth flows, or explicit user-provided secrets/config only.
7. Merge and deploy must remain human-gated.
8. All AI-generated external actions must be auditable and tied to evidence.
9. Build a working vertical slice first, then expand breadth without leaving the core flow half-baked.
10. Do not stop at scaffolding. Deliver a real, runnable system.

Operating instructions:
- Start by reading PLAN.md carefully and inspecting the repository state.
- Explicitly spawn subagents. Do not stay single-agent.
- Use parallel subagents wherever tasks are independent.
- First complete discovery and planning.
- Then implement in milestones.
- After each milestone, verify, fix failures, and continue.
- Do not ask the user for confirmation unless blocked by missing credentials, impossible external access, or a truly ambiguous product contradiction.
- If a live external integration cannot be fully exercised in this environment, still implement it properly, add mocks/dry-run support, add integration tests where possible, and document exactly what remains for live verification.
- Favor a strong, integrated, working product over broad placeholder-only coverage.
- Keep commits and changes logically grouped if git is available, but finishing the product is more important than perfect commit choreography.

Explicit subagent orchestration:
Immediately spawn and use these specialized subagents, then synthesize their outputs before coding:
1. Requirements Analyst
   - Read PLAN.md and extract exact requirements, assumptions, constraints, entities, flows, and acceptance criteria.
   - Produce a structured requirement map and a “must-build now” vs “can be feature-flagged” breakdown.
2. Architecture Lead
   - Propose a concrete production-ready stack, monorepo layout, runtime topology, data model, queueing model, auth model, and integration boundaries.
   - Produce architecture docs and rationale.
3. Backend/Domain Lead
   - Design domain entities, API contracts, orchestration engine, provider adapter interface, runner manager, scheduler, policy engine, audit store, GitHub service, and Telegram/notification services.
4. Frontend/Product Lead
   - Design the dashboard UX, onboarding flow, workspace pages, portfolio inbox, repo control view, run detail view, approvals UX, settings pages, and embedded chat UX.
5. Integrations Lead
   - Design GitHub integration, Codex provider adapter, local runner strategy, remote runner strategy, session discovery/health checks, publish flow, and notification/Telegram quick actions.
6. QA/Release Lead
   - Design test strategy, smoke scenarios, fixtures, CI, docker-compose, local dev flow, mock strategy, failure-state recovery paths, and documentation/runbooks.

After the subagents report back:
- Synthesize one unified implementation plan.
- Write the plan into repo docs.
- Then begin implementation without waiting for further approval.

Technical stack:
Use a TypeScript monorepo unless the repo already strongly dictates otherwise.

Preferred stack:
- Monorepo: `pnpm` + `turbo`
- Web dashboard: `Next.js` (App Router) + TypeScript + Tailwind + a clean component system
- API/control plane: Node.js + TypeScript + Fastify
- Background workers/scheduler: Node.js workers
- Queue: Redis-backed queue
- DB: PostgreSQL with a strong typed ORM and migrations
- Realtime updates: SSE or WebSocket, whichever is simpler and robust
- Telegram bot: TypeScript bot framework
- GitHub integration: official GitHub APIs via Octokit
- Validation: Zod
- Testing: Vitest for unit/integration, Playwright for critical UI flows
- Docker: docker-compose for local/self-hosted bring-up

If you choose a different stack, document exactly why, and keep the same product outcomes.

Target repository structure:
Initialize a clean, maintainable monorepo with something close to:

- `apps/web`              dashboard + onboarding + chat UI
- `apps/api`              control plane API
- `apps/worker`           scheduler + queue workers + remote-runner workers
- `packages/domain`       entities, lifecycle, policies, enums, contracts
- `packages/db`           schema, migrations, repositories
- `packages/orchestrator` orchestration engine and agent role execution
- `packages/provider-core`
- `packages/provider-codex`
- `packages/github`
- `packages/runners`
- `packages/notifications`
- `packages/policy`
- `packages/shared`
- `packages/ui`
- `packages/cli-admin`    fallback/admin/debug only
- `docs/`
- `infra/`
- `.agents/skills/`
- `AGENTS.md`

Create `README.md`, `AGENTS.md`, `.env.example`, `docker-compose.yml`, CI workflows, and developer docs.

What to build — product scope:
Build the system described in PLAN.md, including these major capabilities:

A. Dashboard-first operator UX
- first-run onboarding:
  - connect GitHub
  - detect available local providers such as Codex
  - optionally connect provider auth in-app through official/documented flows
  - add local repos or managed/cloned repos
  - choose local vs remote runner preference per repo/workspace
- workspace view for many repos with useful filters
- portfolio inbox that combines:
  - chat-created tasks
  - GitHub issue-derived tasks
  - scheduled scan opportunities
  - blocked items awaiting approval
- repo control view with:
  - repo summary
  - open task queue
  - active runs
  - branch/PR status
  - failing checks
  - artifact history
- run detail view showing:
  - intent
  - planner output
  - changed files
  - verification logs
  - reviewer judgment
  - PR/comment drafts
  - publish state
- dashboard approvals
- Telegram quick approve/reject/status with deep links back to dashboard

B. Persistent self-hosted runtime
Build a persistent control plane with:
- web app
- API server
- scheduler
- run queue
- policy engine
- notification service
- GitHub integration service
- provider/session manager
- runner manager
- artifact store and database

C. Execution targets
Support:
- local runners for repos on the operator machine
- remote runners for queued/heavy/unattended work

D. Orchestrated role engine
Use stable internal roles:
- scout
- planner
- implementer
- validator
- reviewer
- publisher

E. Provider adapter contract
Implement a provider abstraction with capability flags.
Expose at minimum:
- `healthCheck`
- `listSessions`
- `acquireSession`
- `planTask`
- `executeTask`
- `validateTask`
- `reviewTask`
- `summarizeTask`
- `parseIntent`
- `supportsRemoteExecution`

Implement `provider-codex` first.
For Codex:
- prefer official/local CLI-driven execution as the common path
- shell out cleanly through an adapter boundary
- avoid undocumented credential scraping
- support graceful degraded mode when Codex is unavailable
- add dry-run/demo mode for development

F. GitHub/work management model
Unify task sources:
- natural-language chat prompts
- GitHub issues and PR context
- scheduled scans
- recurring maintenance campaigns

Support:
- issue comments
- draft PRs
- status summaries
- review-ready change logs

Publish autonomy policy:
- AI may plan, code, test, push branch, open/update draft PR, comment on issues, rerun tasks
- merge and deploy must always remain explicitly human-gated

G. Governance, safety, and audit
Implement a policy engine that decides:
- which repos can auto-run
- what task types are eligible for autonomy
- when remote runners may be used
- when publish is allowed
- when human review is mandatory

Hard-stop categories:
- merge
- deploy
- secrets/auth changes without approval policy
- destructive data actions
- production infrastructure mutation

Persist a full audit trail:
- initiator
- provider
- runner
- prompts/contracts used
- artifacts produced
- GitHub actions taken
- approvals and overrides

H. Core domain model
Implement strong typed entities around:
- Workspace
- Repo
- RepoProfile
- ProviderSession
- Runner
- TaskIntent
- TaskCandidate
- TaskPlan
- TaskRun
- ApprovalRequest
- PublishRecord
- Notification
- PolicyRule
- Artifact

Implement lifecycle states:
- discovered
- triaged
- planned
- queued
- running
- validating
- awaiting_approval
- publishing
- published
- blocked
- failed
- archived

I. Operator-facing APIs
Implement APIs and UI flows for:
- repo connect/disconnect/select
- provider session discovery and health
- chat intent submission
- task create/plan/run/retry/cancel
- approval approve/reject/request-changes
- publish PR/comment/push
- scan schedule create/pause/run-now
- audit and artifact retrieval

J. CLI fallback only
Keep CLI limited to admin/debug wrappers around the same API/service layer.

Implementation strategy:
Do this in phases. Do not try to brute-force everything unordered.

Phase 0 — discovery and architecture
- inspect repo
- read PLAN.md
- write:
  - `docs/requirements-map.md`
  - `docs/architecture.md`
  - `docs/implementation-plan.md`
  - `docs/risk-register.md`
  - `docs/verification-plan.md`
- choose the final stack and explain why

Phase 1 — repo bootstrap
- initialize the monorepo
- setup tooling, formatting, linting, typecheck, test infra
- create AGENTS.md
- create a small but useful set of repo-local skills under `.agents/skills/` for future maintenance, such as:
  - implementation-strategy
  - code-change-verification
  - pr-draft-summary
  - provider-contract-check
  - dashboard-smoke-check
- create root scripts so the project has:
  - install
  - dev
  - build
  - lint
  - typecheck
  - test
  - smoke
  - seed/demo
- create CI workflows

Phase 2 — core backend/domain
- implement domain entities and lifecycle
- implement DB schema and migrations
- implement repositories/services
- implement orchestration engine
- implement policy engine
- implement audit/artifact persistence
- implement scheduler and queue plumbing
- implement local runner manager
- implement remote runner model

Phase 3 — provider + GitHub integrations
- implement provider-core contract
- implement provider-codex adapter
- implement session discovery and health
- implement GitHub integration service
- implement publish flow with draft PR support
- build dry-run/mock paths where live auth is missing
- ensure no destructive or undocumented auth hacks

Phase 4 — dashboard + onboarding
- implement onboarding flow
- implement workspace dashboard
- implement portfolio inbox
- implement repo detail/control view
- implement run detail timeline
- implement approvals UI
- implement settings pages

Phase 5 — chat + autonomy flows
- embed chat into dashboard
- convert chat into TaskIntent -> TaskPlan -> TaskRun
- implement planner/implementer/validator/reviewer/publisher flow
- implement scheduled scans and recurring campaigns
- implement multi-repo prioritization

Phase 6 — Telegram + notifications
- implement Telegram integration
- support approve/reject/status quick actions
- deep-link to dashboard
- notification fanout

Phase 7 — hardening
- unit tests
- integration tests
- critical UI tests
- smoke scripts
- docs
- examples
- seed/demo data
- failure recovery UX
- observability/logging

Most important delivery rule:
Before broadening scope, complete one fully working vertical slice end-to-end:

Required vertical slice:
1. User opens dashboard
2. Completes onboarding
3. Adds a repo/workspace
4. Provider health/session is detected for Codex or a clear degraded fallback is shown
5. User submits a chat intent like “fix this issue and prepare a PR”
6. System creates TaskIntent -> TaskPlan -> TaskRun
7. Runner executes plan using provider adapter
8. Validator verifies
9. Reviewer judges
10. Dashboard shows artifacts/timeline
11. Human can approve
12. System can push branch and open/update a draft PR when GitHub auth is available
13. If live publish is unavailable, dry-run output and mocks still prove the path works

Only after this vertical slice works should you extend breadth.

Verification requirements:
After each major phase:
- run lint
- run typecheck
- run unit tests
- run integration tests that are relevant
- run build
- fix failures before moving on

At the end:
- run the full project verification suite
- run at least one realistic smoke path locally
- make sure the app boots
- make sure docker-compose works for local bring-up
- make sure seeded demo data exists so the UI is usable even without live credentials
- make sure mocked provider/GitHub flows exist where live auth is absent

Testing requirements:
Implement tests and/or smoke harnesses for:
- onboarding scenario
- conversational flow
- multi-repo flow
- scheduled autonomy flow
- approval flow
- runner routing flow
- provider flow
- safety flow
- audit flow
- failure flow

Handling missing live credentials:
If GitHub OAuth app credentials, Telegram bot token, Codex availability, or remote runner infra are not available in this environment:
- do not stop the build
- implement the feature behind env/config
- provide dry-run/mock adapters
- provide fixtures and smoke tests
- clearly document exact live setup steps
- mark what was verified locally vs what needs live E2E

Code quality requirements:
- Use strong typing everywhere
- Minimize dead abstractions
- Keep modules cohesive
- Make the domain model explicit
- Add comments only where they materially help
- Prefer maintainability over cleverness
- Avoid fake placeholder files that do nothing
- Every major feature should have a real code path or a clearly isolated, well-documented mock path

Security and privacy requirements:
- Never implement secret scraping or hidden credential exfiltration
- Never automate merge/deploy
- Never bypass branch protections
- Never make destructive infrastructure/data mutations by default
- Store secrets/config safely and document the expected secret sources
- Keep external actions traceable to evidence

Documentation requirements:
By the end, include:
- `README.md` with quickstart and architecture summary
- `AGENTS.md` for future Codex runs
- `docs/local-dev.md`
- `docs/self-hosting.md`
- `docs/provider-codex.md`
- `docs/github-integration.md`
- `docs/telegram.md`
- `docs/policy-and-audit.md`
- `docs/testing.md`
- `docs/demo-walkthrough.md`

Final output requirements:
When you finish, give a concise but complete summary including:
- architecture chosen
- major directories/files created
- what flows are fully implemented
- what was verified locally
- what remains to be live-verified due to external auth/runtime constraints
- exact commands to run locally
- exact env vars/secrets needed
- a short prioritized next-step list

Execution behavior:
- Plan first.
- Use subagents first.
- Synthesize the plan.
- Implement in milestones.
- Verify after each milestone.
- Keep going until the system is genuinely runnable and coherent.

Start now.
