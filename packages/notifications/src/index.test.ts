import { describe, expect, it } from 'vitest';
import { notificationsModule } from './index.js';

describe('notifications', () => {
  it('exports module id', () => {
    expect(notificationsModule).toBe('notifications');
  });
});
