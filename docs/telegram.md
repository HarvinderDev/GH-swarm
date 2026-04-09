# Telegram Integration

Package: `packages/notifications`

Telegram adapter sends run/status updates.

Modes:
- Live mode (`TELEGRAM_LIVE_ENABLED=true`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_DEFAULT_CHAT_ID`)
- Dry-run fallback (default)

Both modes emit auditable artifacts.
