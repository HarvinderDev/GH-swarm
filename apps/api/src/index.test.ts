import { describe, expect, test } from 'vitest';
import { CodexProvider } from '../../../packages/provider-codex/src/index.js';

describe('provider', () => {
  test('returns health info', async () => {
    process.env.CODEX_DRY_RUN = 'true';
    const provider = new CodexProvider();
    const health = await provider.healthCheck();
    expect(health.ok).toBe(true);
  });
});
