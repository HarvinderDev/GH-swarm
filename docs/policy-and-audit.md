# Policy and audit

`packages/policy` enforces explicit human-gated constraints.

Current rules:
- merge/deploy style operations are not automation-allowed.
- publish requires approval.

Audit evidence currently stored as run timeline + artifacts in runtime store.
