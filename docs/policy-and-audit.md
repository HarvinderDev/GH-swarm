# Policy and Audit (Current Slice)

Policy controls are currently represented by configuration gates and routing rules.

Audit artifact schema includes:
- actor
- intent
- payloadSummary
- result
- evidencePointers
- action and integration metadata

Every external integration method is instrumented via `emitExternalAction`.
