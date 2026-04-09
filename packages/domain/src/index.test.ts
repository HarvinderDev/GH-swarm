import { describe, expect, it } from 'vitest';
import { domainModule } from './index.js';

describe('domain', () => {
  it('exports module id', () => {
    expect(domainModule).toBe('domain');
  });
});
