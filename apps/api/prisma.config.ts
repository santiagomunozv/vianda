import { defineConfig } from 'prisma/config';
import { urlBaseDeDatos } from './src/config/base-de-datos.js';
import { cargarArchivosEntorno } from './src/config/entorno.js';

cargarArchivosEntorno();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: urlBaseDeDatos(process.env),
  },
});
