# Architecture (Integration Packages)

## Overview
This slice adds three integration-focused packages and a shared foundation:

- `packages/shared`
  - `audit.ts`: canonical artifact schema + sink interface.
  - `config.ts`: typed env config for live/mode gates.
- `packages/github`
  - `LiveGitHubIntegration`: Octokit-backed live path.
  - `MockGitHubIntegration`: deterministic dry-run path.
  - `createGitHubIntegration`: picks live vs mock.
- `packages/runners`
  - `LocalRunner`: command execution or dry-run simulation.
  - `RemoteRunner`: HTTP-backed remote execution or dry-run simulation.
  - `RunnerRouter`: task routing based on policy and remote availability.
- `packages/notifications`
  - `InAppNotificationAdapter`: in-app persistence boundary.
  - `TelegramNotificationAdapter`: Telegram live/dry-run adapter.
  - `NotificationService`: fan-out to both channels.

## Audit strategy
Every external action call path invokes `emitExternalAction(...)`, producing:
- actor
- intent
- payloadSummary
- result (`success | failure | skipped`)
- evidencePointers
- integration + action metadata and timestamp

## Config gating
`loadIntegrationConfig()` parses env flags and credentials to determine:
- live path availability
- default dry-run behavior
- safe fallback behavior in non-credentialed environments
