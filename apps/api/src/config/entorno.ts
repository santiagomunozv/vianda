import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Funciona igual desde src/config y desde dist/config.
const RAIZ_API = resolve(import.meta.dirname, '../..');
const RAIZ_REPO = resolve(RAIZ_API, '../..');

/**
 * Carga apps/api/.env (variables propias de la API) y el .env de la raíz
 * (PostgreSQL). Nunca sobrescribe variables ya definidas, así que el orden de
 * prioridad es: entorno del proceso, apps/api/.env, .env de la raíz.
 */
export function cargarArchivosEntorno(): void {
  for (const archivo of [resolve(RAIZ_API, '.env'), resolve(RAIZ_REPO, '.env')]) {
    if (existsSync(archivo)) process.loadEnvFile(archivo);
  }
}
