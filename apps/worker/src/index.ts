import { CodexProvider } from '@swarm/provider-codex';

async function tick() {
  const provider = new CodexProvider();
  const health = await provider.healthCheck();
  console.log(`[worker] scheduler tick; provider=${health.detail}`);
}

setInterval(() => {
  tick().catch((error) => console.error(error));
}, 10000);

tick();
