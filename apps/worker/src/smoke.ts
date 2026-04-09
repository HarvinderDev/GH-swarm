import { CodexProvider } from '@swarm/provider-codex';

(async () => {
  process.env.CODEX_DRY_RUN = 'true';
  const health = await new CodexProvider().healthCheck();
  if (!health.ok) throw new Error('worker smoke failed');
  console.log('worker-smoke-ok');
})();
