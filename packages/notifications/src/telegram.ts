import { emitExternalAction } from "../../shared/src/audit.js";
import type {
  NotificationAdapter,
  NotificationDependencies,
  NotificationMessage
} from "./types.js";

export class TelegramNotificationAdapter implements NotificationAdapter {
  channel = "telegram" as const;

  constructor(private readonly deps: NotificationDependencies) {}

  async send(message: NotificationMessage): Promise<{ evidencePointers: string[] }> {
    const chatId = this.deps.telegramDefaultChatId;

    if (!this.deps.telegramLiveEnabled || !this.deps.telegramBotToken || !chatId) {
      const pointer = `mock://telegram/${message.runId ?? "adhoc"}`;
      await emitExternalAction(this.deps.auditSink, {
        integration: "notifications",
        action: "send_telegram_notification",
        actor: message.actor,
        intent: message.intent,
        payloadSummary: {
          title: message.title,
          bodyPreview: message.body.slice(0, 120),
          runId: message.runId,
          mode: "dry-run"
        },
        result: "success",
        evidencePointers: [pointer]
      });
      return { evidencePointers: [pointer] };
    }

    if (this.deps.dryRunDefault) {
      const pointer = `mock://telegram/${message.runId ?? "adhoc"}`;
      await emitExternalAction(this.deps.auditSink, {
        integration: "notifications",
        action: "send_telegram_notification",
        actor: message.actor,
        intent: message.intent,
        payloadSummary: {
          title: message.title,
          bodyPreview: message.body.slice(0, 120),
          runId: message.runId,
          mode: "dry-run"
        },
        result: "success",
        evidencePointers: [pointer]
      });
      return { evidencePointers: [pointer] };
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.deps.telegramBotToken}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `${message.title}\n\n${message.body}${message.link ? `\n\n${message.link}` : ""}`,
            disable_web_page_preview: false
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Telegram sendMessage returned ${response.status}`);
      }

      const payload = (await response.json()) as {
        result?: { message_id?: number };
      };
      const pointer = `https://t.me/c/${chatId}/${payload.result?.message_id ?? "unknown"}`;

      await emitExternalAction(this.deps.auditSink, {
        integration: "notifications",
        action: "send_telegram_notification",
        actor: message.actor,
        intent: message.intent,
        payloadSummary: {
          title: message.title,
          bodyPreview: message.body.slice(0, 120),
          runId: message.runId,
          mode: "live"
        },
        result: "success",
        evidencePointers: [pointer]
      });

      return { evidencePointers: [pointer] };
    } catch (error) {
      await emitExternalAction(this.deps.auditSink, {
        integration: "notifications",
        action: "send_telegram_notification",
        actor: message.actor,
        intent: message.intent,
        payloadSummary: {
          title: message.title,
          bodyPreview: message.body.slice(0, 120),
          runId: message.runId,
          mode: "live"
        },
        result: "failure",
        evidencePointers: [],
        error: String(error)
      });
      throw error;
    }
  }
}
