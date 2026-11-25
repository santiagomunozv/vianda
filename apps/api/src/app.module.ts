import { Module } from '@nestjs/common';
import { SaludModule } from './salud/salud.module.js';

@Module({
  imports: [SaludModule],
})
export class AppModule {}
