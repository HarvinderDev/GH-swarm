import Fastify from 'fastify';
import { CodexProvider } from '@swarm/provider-codex';
import { SwarmOrchestrator } from '@swarm/orchestrator';
import { createRuntimeStore } from './store.js';

async function buildServer() {
  const provider = new CodexProvider();
  const store = await createRuntimeStore();
  const orchestrator = new SwarmOrchestrator(provider, store);

  const app = Fastify({ logger: true });

  app.get('/health', async () => ({ ok: true, service: 'api' }));
  app.get('/provider/health', async () => provider.healthCheck());
  app.get('/state', async () => store);

  app.post('/workspaces', {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        additionalProperties: false,
        properties: { name: { type: 'string', minLength: 1 } }
      }
    }
  }, async (req) => {
    const body = req.body as { name: string };
    return orchestrator.createWorkspace(body.name);
  });

  app.post('/repos', {
    schema: {
      body: {
        type: 'object',
        required: ['workspaceId', 'fullName'],
        additionalProperties: false,
        properties: {
          workspaceId: { type: 'string', minLength: 1 },
          fullName: { type: 'string', minLength: 3 }
        }
      }
    }
  }, async (req) => {
    const body = req.body as { workspaceId: string; fullName: string };
    return orchestrator.createRepo(body.workspaceId, body.fullName);
  });

  app.post('/chat/intents', {
    schema: {
      body: {
        type: 'object',
        required: ['workspaceId', 'repoId', 'prompt'],
        additionalProperties: false,
        properties: {
          workspaceId: { type: 'string', minLength: 1 },
          repoId: { type: 'string', minLength: 1 },
          prompt: { type: 'string', minLength: 1 }
        }
      }
    }
  }, async (req) => {
    const body = req.body as { workspaceId: string; repoId: string; prompt: string };
    return orchestrator.runIntent(body.workspaceId, body.repoId, body.prompt);
  });

  app.post('/approvals/:runId/approve', {
    schema: {
      params: {
        type: 'object',
        required: ['runId'],
        additionalProperties: false,
        properties: { runId: { type: 'string', minLength: 1 } }
      }
    }
  }, async (req) => {
    const runId = (req.params as { runId: string }).runId;
    return orchestrator.approveAndPublish(runId);
  });

  app.post('/approvals/:runId/reject', {
    schema: {
      params: {
        type: 'object',
        required: ['runId'],
        additionalProperties: false,
        properties: { runId: { type: 'string', minLength: 1 } }
      },
      body: {
        type: 'object',
        additionalProperties: false,
        properties: { reason: { type: 'string', minLength: 1 } }
      }
    }
  }, async (req) => {
    const runId = (req.params as { runId: string }).runId;
    const reason = (req.body as { reason?: string } | undefined)?.reason;
    return orchestrator.rejectApproval(runId, reason);
  });

  app.setErrorHandler((error, _, reply) => {
    const err = error as { message?: string; validation?: unknown };

    if (err.validation) {
      reply.status(400).send({ message: 'Invalid request', detail: err.message ?? 'Validation failed' });
      return;
    }

    reply.status(400).send({ message: err.message ?? 'Request failed' });
  });

  return app;
}

const start = async () => {
  const app = await buildServer();
  const port = Number(process.env.API_PORT ?? '4000');
  await app.listen({ port, host: '0.0.0.0' });
};

start();
