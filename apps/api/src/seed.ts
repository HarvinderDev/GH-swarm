import { store } from './store.js';

store.workspaces.push({ id: 'ws-demo', name: 'Demo Workspace', createdAt: new Date().toISOString() });
store.repos.push({ id: 'repo-demo', workspaceId: 'ws-demo', name: 'repo', fullName: 'demo/repo', defaultBranch: 'main' });
console.log('seeded-demo');
