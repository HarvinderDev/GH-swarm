#!/usr/bin/env bash
set -euo pipefail

bash scripts/smoke-onboarding.sh
bash scripts/smoke-chat-intent.sh
bash scripts/smoke-approval-flow.sh
bash scripts/smoke-publish-dry-run.sh

echo "[smoke] all smoke scenarios passed"
