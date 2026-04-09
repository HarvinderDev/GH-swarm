import { spawnSync } from 'node:child_process';

const scripts = [
  'scripts/smoke-onboarding.sh',
  'scripts/smoke-chat-intent.sh',
  'scripts/smoke-approval-flow.sh',
  'scripts/smoke-publish-dry-run.sh'
];

for (const script of scripts) {
  const result = spawnSync('bash', [script], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`Smoke script failed: ${script}`);
    process.exit(result.status ?? 1);
  }
}

console.log('Test suite passed.');
