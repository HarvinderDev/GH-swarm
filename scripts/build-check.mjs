import { readFileSync } from 'node:fs';

const compose = readFileSync('docker-compose.yml', 'utf8');
const requiredServices = ['web:', 'api:', 'worker:', 'db:', 'redis:'];
const missing = requiredServices.filter((service) => !compose.includes(service));

if (missing.length > 0) {
  console.error('Build validation failed. Missing compose services:');
  for (const service of missing) console.error(`- ${service}`);
  process.exit(1);
}

console.log('Build validation passed.');
