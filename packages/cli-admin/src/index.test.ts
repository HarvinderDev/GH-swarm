import { describe, expect, it } from 'vitest';
import { cli_adminModule } from './index.js';

describe('cli-admin', () => {
  it('exports module id', () => {
    expect(cli_adminModule).toBe('cli-admin');
  });
});
