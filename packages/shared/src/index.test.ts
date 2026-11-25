import { describe, expect, it } from 'vitest';
import { esquemaSalud } from './index';

describe('esquemaSalud', () => {
  it('acepta una respuesta válida', () => {
    expect(esquemaSalud.parse({ estado: 'ok' })).toEqual({ estado: 'ok' });
  });

  it('rechaza una respuesta inválida', () => {
    expect(esquemaSalud.safeParse({ estado: 'caido' }).success).toBe(false);
  });
});
