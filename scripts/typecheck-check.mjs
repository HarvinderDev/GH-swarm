import { readFileSync } from 'node:fs';

const content = readFileSync('.env.example', 'utf8');
const requiredEnvVars = [
  'NODE_ENV',
  'WEB_PORT',
  'API_PORT',
  'WORKER_CONCURRENCY',
  'DATABASE_URL',
  'REDIS_URL',
  'GITHUB_APP_ID',
  'GITHUB_APP_PRIVATE_KEY',
  'GITHUB_WEBHOOK_SECRET',
  'CODEX_MODE',
  'CODEX_CLI_PATH',
  'TELEGRAM_BOT_TOKEN',
  'AUDIT_RETENTION_DAYS',
  'PUBLISH_DRY_RUN'
];

const missing = requiredEnvVars.filter((key) => !content.includes(`${key}=`));
if (missing.length > 0) {
  console.error('Typecheck config validation failed. Missing env vars:');
  for (const key of missing) console.error(`- ${key}`);
  process.exit(1);
}

console.log('Typecheck config validation passed.');
