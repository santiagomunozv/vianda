# 0013. Configuración de PostgreSQL en un solo .env y recarga de la API

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
En el scaffolding, las credenciales de PostgreSQL estaban escritas en `docker-compose.yml` y en el script de inicio, y repetidas en el `DATABASE_URL` de `apps/api/.env`, así que podían desalinearse. Además, `nest start --watch` solo vigila el código de la API: un cambio en `packages/equivalencias` no la reiniciaba (consecuencia anotada en 0010). Desde el paso 6 el motor se edita constantemente.

## Decisión
- **Una sola fuente de verdad para PostgreSQL:** el `.env` de la raíz (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_DB_TEST`), con su `.env.example` versionado.
  - `docker-compose.yml` lee esas variables por interpolación y falla si falta alguna.
  - El script de inicio (`docker/postgres/init/01-base-de-pruebas.sh`) crea la base de pruebas con `POSTGRES_DB_TEST`.
  - La API no tiene `DATABASE_URL`: la construye `urlBaseDeDatos` (`apps/api/src/config/base-de-datos.ts`), que valida las variables con Zod y codifica usuario y contraseña. La usan `prisma.config.ts` y, desde el paso 4, el cliente de Prisma de la API.
  - `apps/api/.env` queda solo para variables propias de la API (`PORT`, y más adelante secretos de tokens).
- **Carga de archivos de entorno con `process.loadEnvFile` de Node**, sin dotenv. Nunca sobrescribe variables existentes, así que la prioridad es: entorno del proceso, `apps/api/.env` y luego el `.env` de la raíz.
- **Recarga de la API en desarrollo:** `pnpm --filter api dev` compila una vez con `tsc` y luego corre en paralelo (con `concurrently`) `tsc --watch` y `node --watch dist/main.js`. `node --watch` reinicia el proceso cuando cambia cualquier módulo cargado, incluidos los `dist` de `shared` y `equivalencias`. Esto reemplaza la consecuencia de 0010 que decía que la API no se reinicia sola.
- `pnpm dev:api`, `pnpm dev:web` y `pnpm dev:mobile` levantan una sola app con los paquetes compilados y en watch.

## Consecuencias
- Cambiar usuario, contraseña, puerto o nombres de bases se hace en un solo lugar. Como el script de inicio solo corre al crear el volumen, hay que recrearlo con `pnpm db:reset`, que borra los datos locales.
- En producción no existe un `DATABASE_URL` directo: el proveedor que se elija debe exponer las variables `POSTGRES_*`. Si solo ofrece una URL, se revisa esta decisión.
- La API en desarrollo se reinicia tanto por cambios propios como de los paquetes, en unos 2 segundos. `nest build` sigue usándose para el build de producción.
