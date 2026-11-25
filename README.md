# vianda

App que convierte un plan de nutrición por intercambios en comidas reales: dice qué te toca comer y cuánto es cada porción, sin calcular a mano.

Monorepo TypeScript con pnpm workspaces y Turborepo:

| Carpeta                  | Qué es                                                    | Puerto |
| ------------------------ | --------------------------------------------------------- | ------ |
| `apps/api`               | API REST con Nest.js, Prisma y PostgreSQL                 | 3000   |
| `apps/web`               | Configuración del catálogo y del plan (React + Vite)      | 5173   |
| `apps/mobile`            | Uso diario (Expo + Expo Router)                           | 8081   |
| `packages/shared`        | Tipos, enums y esquemas Zod compartidos                   | —      |
| `packages/equivalencias` | Motor puro de cálculo de porciones                        | —      |

La documentación de producto, arquitectura y decisiones está en [`docs/`](docs/).

## Requisitos

- Node 24 (ver `.nvmrc`).
- pnpm a través de corepack: `corepack enable pnpm`. La versión exacta está fijada en `package.json`.
- Docker, solo para PostgreSQL. Las apps corren nativas.
- Para la app móvil: Expo Go en el teléfono, o el simulador de iOS o el emulador de Android.

## Levantar todo desde cero

```sh
# 1. Dependencias
pnpm install

# 2. Variables de entorno
cp .env.example .env                    # PostgreSQL: usuario, contraseña, bases, puerto
cp apps/api/.env.example apps/api/.env  # variables propias de la API

# 3. Base de datos
pnpm db:up        # levanta PostgreSQL y crea las bases principal y de pruebas
pnpm db:migrate   # aplica las migraciones
pnpm db:seed      # carga los datos iniciales

# 4. Las tres apps
pnpm dev
```

`pnpm dev` compila primero `shared` y `equivalencias` y después arranca la API, la web y Metro (Expo). Los paquetes quedan en modo watch: al editarlos, la API se reinicia sola y la web y la app móvil recargan.

- API: <http://localhost:3000/salud>
- Web: <http://localhost:5173>
- Móvil: Metro en <http://localhost:8081>. Para abrir la app, ver la sección siguiente.

## Levantar cada app por separado

Cada comando compila los paquetes una vez y los deja en modo watch junto con la app:

```sh
pnpm dev:api      # solo la API (requiere pnpm db:up)
pnpm dev:web      # solo la web
pnpm dev:mobile   # solo Metro
```

Las teclas interactivas de Expo (`i` para iOS, `a` para Android, escanear el QR) no llegan a través de Turborepo. Para usarlas, abre otra terminal con los paquetes ya compilados (`pnpm build` o `pnpm dev:api` corriendo) y ejecuta:

```sh
pnpm --filter mobile dev       # Metro con el menú interactivo
pnpm --filter mobile ios       # abre directamente el simulador de iOS
pnpm --filter mobile android   # abre directamente el emulador de Android
```

## Variables de entorno

| Archivo         | Contenido                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `.env`          | `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_DB_TEST` |
| `apps/api/.env` | Variables propias de la API (`PORT`)                                                                  |

El `.env` de la raíz es la única fuente de verdad de PostgreSQL: `docker-compose.yml` crea el contenedor y las bases con esos valores, y la API arma su URL de conexión con ellos. No hay un `DATABASE_URL` que mantener a mano. Solo se versionan los `.env.example`.

El script que crea la base de pruebas corre solo la primera vez que se inicializa el volumen. Si cambias usuario, contraseña o nombres de las bases, recrea el volumen con `pnpm db:reset`, que **borra los datos locales**.

## Otros comandos

| Comando                          | Qué hace                                                    |
| -------------------------------- | ----------------------------------------------------------- |
| `pnpm build`                     | Compila paquetes y apps                                     |
| `pnpm test`                      | Pruebas de todo el monorepo                                 |
| `pnpm lint`                      | ESLint en todo el monorepo                                  |
| `pnpm typecheck`                 | Verificación de tipos                                       |
| `pnpm format` / `format:check`   | Aplica o verifica Prettier                                  |
| `pnpm db:down`                   | Detiene PostgreSQL (conserva los datos)                     |
| `pnpm db:reset`                  | Borra el volumen y recrea las bases vacías                  |
| `pnpm --filter api db:generate`  | Regenera el cliente de Prisma                               |
