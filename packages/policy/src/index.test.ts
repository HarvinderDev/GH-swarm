import { describe, expect, it } from 'vitest';
import { policyModule } from './index.js';

describe('policy', () => {
  it('exports module id', () => {
    expect(policyModule).toBe('policy');
  });
});
