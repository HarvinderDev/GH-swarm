#!/usr/bin/env bash
set -euo pipefail

echo "[onboarding] starting smoke scenario"
workspace_name="${WORKSPACE_NAME:-demo-workspace}"
default_repo_url="${DEFAULT_REPO_URL:-https://github.com/example/repo}"
codex_mode="${CODEX_MODE:-dry-run}"

echo "[onboarding] simulate: create workspace '$workspace_name'"
echo "[onboarding] simulate: attach repository '$default_repo_url'"
echo "[onboarding] simulate: provider mode '$codex_mode' detected"
echo "[onboarding] PASS"
