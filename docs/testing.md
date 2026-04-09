# Testing

Current baseline verification for provider packages:

- type checking via `tsc --noEmit`
- compilation via `tsc`
- workspace `node --test` smoke command

Future enhancements:

- CLI command adapter unit tests with mocked process execution
- integration test matrix for codex CLI JSON compatibility
