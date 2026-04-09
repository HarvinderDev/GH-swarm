# Risk register (current milestone)

- Live integration drift risk: dry-run scripts can pass while live auth flows fail.
  - Mitigation: explicit "requires live E2E" sections in all integration docs.
- Placeholder runtime risk: compose services are scaffolding entrypoints.
  - Mitigation: keep topology stable while incrementally replacing placeholders with real apps.
- Credential handling risk in self-hosted deployments.
  - Mitigation: document exact env vars and enforce human-gated publish policy defaults.
