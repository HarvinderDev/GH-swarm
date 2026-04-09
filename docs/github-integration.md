# GitHub Integration

Package: `packages/github`

Capabilities:
- Issue context ingestion
- Draft PR creation/update
- Status comment posting

Modes:
- Live mode (`GITHUB_LIVE_ENABLED=true` + `GITHUB_TOKEN`)
- Mock mode fallback (default)

All operations emit audit artifacts with evidence pointers.
