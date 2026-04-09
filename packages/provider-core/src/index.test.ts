import { describe, expect, it } from 'vitest';
import { provider_coreModule } from './index.js';

describe('provider-core', () => {
  it('exports module id', () => {
    expect(provider_coreModule).toBe('provider-core');
  });
});
