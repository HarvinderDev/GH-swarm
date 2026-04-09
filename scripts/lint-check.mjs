import { existsSync } from 'node:fs';

const required = [
  '.github/workflows/ci.yml',
  'docker-compose.yml',
  '.env.example',
  'docs/testing.md'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.error('Lint structural check failed. Missing required files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('Lint structural check passed.');
