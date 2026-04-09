# Telegram integration

## Environment variables

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Supported quick actions (planned flow)

- Approve run
- Reject run
- Request status

## Local verification

No network Telegram calls are executed in default smoke mode.

## Live E2E requirements

- Bot token issued by BotFather.
- Bot added to target chat.
- API endpoint reachable by Telegram webhook/polling strategy.

## Verified locally vs live E2E

### Verified locally
- Configuration documentation and gating expectations.

### Requires live E2E credentials
- Delivery and action callback handling in Telegram chats.
