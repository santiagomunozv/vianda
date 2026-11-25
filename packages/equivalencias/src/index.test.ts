import { describe, expect, it } from 'vitest';
import { VERSION_MOTOR } from './index';

describe('equivalencias', () => {
  it('expone la versión del motor', () => {
    expect(VERSION_MOTOR).toBe('0.0.0');
  });
});
