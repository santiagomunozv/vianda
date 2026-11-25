import { Controller, Get } from '@nestjs/common';
import { VERSION_MOTOR } from '@vianda/equivalencias';
import { esquemaSalud, type Salud } from '@vianda/shared';

type RespuestaSalud = Salud & { motor: string };

@Controller('salud')
export class SaludController {
  @Get()
  consultar(): RespuestaSalud {
    return { ...esquemaSalud.parse({ estado: 'ok' }), motor: VERSION_MOTOR };
  }
}
