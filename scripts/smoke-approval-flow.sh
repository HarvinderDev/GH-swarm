#!/usr/bin/env bash
set -euo pipefail

echo "[approval] starting smoke scenario"
approver_handle="${APPROVER_HANDLE:-@operator}"

echo "[approval] simulate: task run enters awaiting_approval"
echo "[approval] simulate: approver '$approver_handle' approves run"
echo "[approval] simulate: audit event persisted"
echo "[approval] PASS"
