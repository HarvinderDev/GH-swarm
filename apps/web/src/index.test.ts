import { describe, expect, it } from 'vitest';
import { webModule } from './index.js';

describe('web', () => {
  it('exports module id', () => {
    expect(webModule).toBe('web');
  });
});
