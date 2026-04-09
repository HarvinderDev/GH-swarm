import { describe, expect, it } from 'vitest';
import { sharedModule } from './index.js';

describe('shared', () => {
  it('exports module id', () => {
    expect(sharedModule).toBe('shared');
  });
});
