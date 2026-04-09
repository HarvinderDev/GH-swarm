# Architecture note (current milestone)

## Runtime topology

- `web` service: dashboard frontend runtime entrypoint.
- `api` service: control plane API runtime entrypoint.
- `worker` service: async orchestration/queue worker runtime entrypoint.
- `db` service: PostgreSQL persistence.
- `redis` service: queue/cache transport.

This milestone establishes local infrastructure and workflow guardrails (CI + smoke) rather than full app code.
