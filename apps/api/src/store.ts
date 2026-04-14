import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { RuntimeStore } from '@swarm/orchestrator';

const storePath = resolve(process.cwd(), '.data/runtime-store.json');

const emptyStoreState: Omit<RuntimeStore, 'save'> = {
  workspaces: [],
  repos: [],
  intents: [],
  plans: [],
  runs: [],
  approvals: []
};

export async function createRuntimeStore(): Promise<RuntimeStore> {
  const fileData = await loadStoreFromDisk();
  const state: Omit<RuntimeStore, 'save'> = {
    workspaces: fileData?.workspaces ?? [],
    repos: fileData?.repos ?? [],
    intents: fileData?.intents ?? [],
    plans: fileData?.plans ?? [],
    runs: fileData?.runs ?? [],
    approvals: fileData?.approvals ?? []
  };

  return {
    ...state,
    async save() {
      await mkdir(dirname(storePath), { recursive: true });
      await writeFile(storePath, JSON.stringify(state, null, 2), 'utf8');
    }
  };
}

async function loadStoreFromDisk(): Promise<Omit<RuntimeStore, 'save'> | null> {
  try {
    const raw = await readFile(storePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<Omit<RuntimeStore, 'save'>>;
    return {
      ...emptyStoreState,
      ...parsed
    };
  } catch {
    return null;
  }
}
