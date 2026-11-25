import { Test } from '@nestjs/testing';
import { SaludController } from './salud.controller.js';

describe('SaludController', () => {
  it('responde ok con la versión del motor', async () => {
    const modulo = await Test.createTestingModule({
      controllers: [SaludController],
    }).compile();

    const controller = modulo.get(SaludController);
    expect(controller.consultar()).toEqual({ estado: 'ok', motor: '0.0.0' });
  });
});
