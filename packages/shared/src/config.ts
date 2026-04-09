import { z } from "zod";

const configSchema = z.object({
  githubLiveEnabled: z.boolean().default(false),
  githubToken: z.string().optional(),
  runnerRemoteEnabled: z.boolean().default(false),
  runnerRemoteEndpoint: z.string().optional(),
  runnerRemoteToken: z.string().optional(),
  telegramLiveEnabled: z.boolean().default(false),
  telegramBotToken: z.string().optional(),
  telegramDefaultChatId: z.string().optional(),
  dryRunDefault: z.boolean().default(true)
});

export type IntegrationConfig = z.infer<typeof configSchema>;

const toBoolean = (value: string | undefined): boolean =>
  value === "1" || value === "true" || value === "TRUE";

export function loadIntegrationConfig(
  env: NodeJS.ProcessEnv = process.env
): IntegrationConfig {
  return configSchema.parse({
    githubLiveEnabled: toBoolean(env.GITHUB_LIVE_ENABLED),
    githubToken: env.GITHUB_TOKEN,
    runnerRemoteEnabled: toBoolean(env.RUNNER_REMOTE_ENABLED),
    runnerRemoteEndpoint: env.RUNNER_REMOTE_ENDPOINT,
    runnerRemoteToken: env.RUNNER_REMOTE_TOKEN,
    telegramLiveEnabled: toBoolean(env.TELEGRAM_LIVE_ENABLED),
    telegramBotToken: env.TELEGRAM_BOT_TOKEN,
    telegramDefaultChatId: env.TELEGRAM_DEFAULT_CHAT_ID,
    dryRunDefault:
      env.DRY_RUN_DEFAULT === undefined ? true : toBoolean(env.DRY_RUN_DEFAULT)
  });
}
