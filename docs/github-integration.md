# GitHub integration

`packages/github` exposes draft PR publish boundary.

- `GITHUB_DRY_RUN=true` (default): mock publish with deterministic URL.
- `GITHUB_DRY_RUN=false`: live mode placeholder for Octokit-backed publish.

All publish events are attached to run artifacts.
