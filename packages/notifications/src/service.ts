import type {
  NotificationDependencies,
  NotificationMessage
} from "./types.js";
import { InAppNotificationAdapter } from "./in-app.js";
import { TelegramNotificationAdapter } from "./telegram.js";

export class NotificationService {
  private readonly inApp: InAppNotificationAdapter;
  private readonly telegram: TelegramNotificationAdapter;

  constructor(private readonly deps: NotificationDependencies) {
    this.inApp = new InAppNotificationAdapter(deps);
    this.telegram = new TelegramNotificationAdapter(deps);
  }

  async notify(message: NotificationMessage) {
    const [inAppResult, telegramResult] = await Promise.all([
      this.inApp.send(message),
      this.telegram.send(message)
    ]);

    return {
      inApp: inAppResult,
      telegram: telegramResult
    };
  }
}
