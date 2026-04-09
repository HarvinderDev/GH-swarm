import { describe, expect, it } from 'vitest';
import { orchestratorModule } from './index.js';

describe('orchestrator', () => {
  it('exports module id', () => {
    expect(orchestratorModule).toBe('orchestrator');
  });
});
