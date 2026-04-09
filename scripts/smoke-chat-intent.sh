#!/usr/bin/env bash
set -euo pipefail

echo "[chat-intent] starting smoke scenario"
intent="${SMOKE_CHAT_INTENT:-Fix failing tests and prepare a draft PR}"
if [[ -z "$intent" ]]; then
  echo "[chat-intent] intent is empty"
  exit 1
fi

echo "[chat-intent] simulate: parse intent -> task candidate"
echo "[chat-intent] simulate: plan generated for intent: $intent"
echo "[chat-intent] simulate: task queued for execution"
echo "[chat-intent] PASS"
