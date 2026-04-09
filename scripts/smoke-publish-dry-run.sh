#!/usr/bin/env bash
set -euo pipefail

echo "[publish-dry-run] starting smoke scenario"
if [[ "${PUBLISH_DRY_RUN:-true}" != "true" ]]; then
  echo "[publish-dry-run] expected PUBLISH_DRY_RUN=true for this smoke"
  exit 1
fi

echo "[publish-dry-run] simulate: create branch in dry-run mode"
echo "[publish-dry-run] simulate: generate draft PR payload only"
echo "[publish-dry-run] simulate: no live GitHub mutation executed"
echo "[publish-dry-run] PASS"
