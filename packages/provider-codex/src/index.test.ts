import { describe, expect, it } from 'vitest';
import { provider_codexModule } from './index.js';

describe('provider-codex', () => {
  it('exports module id', () => {
    expect(provider_codexModule).toBe('provider-codex');
  });
});
