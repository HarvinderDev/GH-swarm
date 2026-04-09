import { describe, expect, it } from 'vitest';
import { workerModule } from './index.js';

describe('worker', () => {
  it('exports module id', () => {
    expect(workerModule).toBe('worker');
  });
});
