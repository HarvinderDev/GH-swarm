import { describe, expect, it } from 'vitest';
import { runnersModule } from './index.js';

describe('runners', () => {
  it('exports module id', () => {
    expect(runnersModule).toBe('runners');
  });
});
