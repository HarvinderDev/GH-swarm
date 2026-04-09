import { emitExternalAction } from "../../shared/src/audit.js";
import type {
  NotificationAdapter,
  NotificationDependencies,
  NotificationMessage
} from "./types.js";

export class InAppNotificationAdapter implements NotificationAdapter {
  channel = "in_app" as const;

  constructor(private readonly deps: NotificationDependencies) {}

  async send(message: NotificationMessage): Promise<{ evidencePointers: string[] }> {
    const pointer = `db://notifications/${message.runId ?? "adhoc"}`;
    await emitExternalAction(this.deps.auditSink, {
      integration: "notifications",
      action: "send_in_app_notification",
      actor: message.actor,
      intent: message.intent,
      payloadSummary: {
        title: message.title,
        bodyPreview: message.body.slice(0, 120),
        runId: message.runId,
        link: message.link,
        mode: "live"
      },
      result: "success",
      evidencePointers: [pointer]
    });
    return { evidencePointers: [pointer] };
  }
}
