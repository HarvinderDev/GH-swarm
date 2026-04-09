import { CodexProvider } from '@swarm/provider-codex';
import { SwarmOrchestrator } from '@swarm/orchestrator';
import { store } from './store.js';

async function run() {
  process.env.CODEX_DRY_RUN = 'true';
  const orchestrator = new SwarmOrchestrator(new CodexProvider(), store);
  const workspace = orchestrator.createWorkspace('demo');
  const repo = orchestrator.createRepo(workspace.id, 'demo/repo');
  const result = await orchestrator.runIntent(workspace.id, repo.id, 'fix lint errors and prepare draft pr');
  await orchestrator.approveAndPublish(result.run.id);
  console.log('smoke-ok');
}

run();
