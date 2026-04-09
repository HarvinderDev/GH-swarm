import type { AuditActor, AuditSink } from "../../shared/src/audit.js";

export type NotificationChannel = "in_app" | "telegram";

export type NotificationMessage = {
  actor: AuditActor;
  intent: string;
  title: string;
  body: string;
  runId?: string;
  link?: string;
};

export interface NotificationAdapter {
  channel: NotificationChannel;
  send(message: NotificationMessage): Promise<{ evidencePointers: string[] }>;
}

export type NotificationDependencies = {
  auditSink: AuditSink;
  telegramLiveEnabled: boolean;
  telegramBotToken?: string;
  telegramDefaultChatId?: string;
  dryRunDefault: boolean;
};
