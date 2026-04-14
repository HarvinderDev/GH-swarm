import { createRuntimeStore } from './store.js';

async function seed() {
  const store = await createRuntimeStore();

  if (!store.workspaces.some((workspace) => workspace.id === 'ws-demo')) {
    store.workspaces.push({ id: 'ws-demo', name: 'Demo Workspace', createdAt: new Date().toISOString() });
  }

  if (!store.repos.some((repo) => repo.id === 'repo-demo')) {
    store.repos.push({ id: 'repo-demo', workspaceId: 'ws-demo', name: 'repo', fullName: 'demo/repo', defaultBranch: 'main' });
  }

  await store.save?.();
  console.log('seeded-demo');
}

seed();
