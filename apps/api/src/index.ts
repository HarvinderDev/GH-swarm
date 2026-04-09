import Fastify from 'fastify';
import { CodexProvider } from '@swarm/provider-codex';
import { SwarmOrchestrator } from '@swarm/orchestrator';
import { store } from './store.js';

const provider = new CodexProvider();
const orchestrator = new SwarmOrchestrator(provider, store);

const app = Fastify({ logger: true });

app.get('/health', async () => ({ ok: true, service: 'api' }));
app.get('/provider/health', async () => provider.healthCheck());
app.get('/state', async () => store);

app.post('/workspaces', async (req) => {
  const body = req.body as { name: string };
  return orchestrator.createWorkspace(body.name);
});

app.post('/repos', async (req) => {
  const body = req.body as { workspaceId: string; fullName: string };
  return orchestrator.createRepo(body.workspaceId, body.fullName);
});

app.post('/chat/intents', async (req) => {
  const body = req.body as { workspaceId: string; repoId: string; prompt: string };
  return orchestrator.runIntent(body.workspaceId, body.repoId, body.prompt);
});

app.post('/approvals/:runId/approve', async (req) => {
  const runId = (req.params as { runId: string }).runId;
  return orchestrator.approveAndPublish(runId);
});

const start = async () => {
  const port = Number(process.env.API_PORT ?? '4000');
  await app.listen({ port, host: '0.0.0.0' });
};

start();
