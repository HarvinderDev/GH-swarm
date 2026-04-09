import { describe, expect, it } from 'vitest';
import { githubModule } from './index.js';

describe('github', () => {
  it('exports module id', () => {
    expect(githubModule).toBe('github');
  });
});
