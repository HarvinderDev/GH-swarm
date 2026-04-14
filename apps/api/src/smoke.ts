import { CodexProvider } from '@swarm/provider-codex';
import { SwarmOrchestrator } from '@swarm/orchestrator';
import { createRuntimeStore } from './store.js';

async function run() {
  process.env.CODEX_DRY_RUN = 'true';
  const store = await createRuntimeStore();
  const orchestrator = new SwarmOrchestrator(new CodexProvider(), store);
  const workspace = await orchestrator.createWorkspace('demo');
  const repo = await orchestrator.createRepo(workspace.id, 'demo/repo');
  const result = await orchestrator.runIntent(workspace.id, repo.id, 'fix lint errors and prepare draft pr');
  await orchestrator.approveAndPublish(result.run.id);
  console.log('smoke-ok');
}

run();
