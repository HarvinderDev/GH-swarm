import { describe, expect, it } from 'vitest';
import { uiModule } from './index.js';

describe('ui', () => {
  it('exports module id', () => {
    expect(uiModule).toBe('ui');
  });
});
