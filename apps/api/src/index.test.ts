import { describe, expect, it } from 'vitest';
import { bootstrapApi } from './index.js';

describe('bootstrapApi', () => {
  it('returns readiness', () => {
    expect(bootstrapApi()).toBe('api ready');
  });
});
