import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { cargarArchivosEntorno } from './config/entorno.js';

cargarArchivosEntorno();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env['PORT'] ?? 3000);
}
await bootstrap();
