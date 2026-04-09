import { describe, expect, it } from 'vitest';
import { dbModule } from './index.js';

describe('db', () => {
  it('exports module id', () => {
    expect(dbModule).toBe('db');
  });
});
