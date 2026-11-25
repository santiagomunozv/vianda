# Vianda

App que convierte un plan de nutrición por intercambios en comidas reales: dice qué te toca comer y cuánto es cada porción, sin calcular a mano. No crea planes ni da consejo nutricional; ejecuta planes de profesionales.

## Estado del repo

Proyecto nuevo. Estamos en la **fase 1**. El alcance y el orden de trabajo están en `docs/fase-1.md`. Si el monorepo aún no existe, la primera tarea es el scaffolding descrito ahí.

## Estructura

```
apps/api        Nest.js + Prisma + PostgreSQL
apps/web        React + Vite (configuración: catálogo y plan)
apps/mobile     React Native + Expo + Expo Router (uso diario)
packages/shared         tipos, esquemas Zod y contratos de la API
packages/equivalencias  motor de cálculo de porciones (TypeScript puro)
docs/                   producto, arquitectura, modelo de datos, decisiones
```

Gestión del monorepo: pnpm workspaces + Turborepo. Todo el proyecto es TypeScript en modo estricto.

## Comandos

Requisitos: Node 24 (`.nvmrc`), corepack activado (`corepack enable pnpm`) y Docker. Copia `.env.example` a `.env` (PostgreSQL) y `apps/api/.env.example` a `apps/api/.env`. Guía completa para personas en `README.md`.

- `pnpm install` instala todo el monorepo.
- `pnpm dev` compila los paquetes una vez y levanta api (3000), web (5173) y mobile (Metro, 8081) con Turborepo; los paquetes quedan en modo watch y la API se reinicia sola cuando cambia su código o el `dist` de un paquete.
- `pnpm dev:api`, `pnpm dev:web`, `pnpm dev:mobile` levantan una sola app con los paquetes en watch.
- `pnpm --filter <app> <script>` corre un script de una app (`api`, `web`, `mobile`); requiere los paquetes ya compilados. Los paquetes se llaman `@vianda/shared` y `@vianda/equivalencias`.
- `pnpm build` compila paquetes y apps.
- `pnpm test`, `pnpm lint`, `pnpm typecheck` en todo el monorepo.
- `pnpm format` aplica Prettier; `pnpm format:check` solo verifica.
- `pnpm db:up` y `pnpm db:down` levantan y detienen PostgreSQL con Docker Compose.
- `pnpm db:reset` borra el volumen de PostgreSQL y recrea las bases vacías.
- `pnpm db:migrate` corre `prisma migrate dev` en `apps/api`.
- `pnpm db:seed` carga los datos iniciales.
- `pnpm --filter api db:generate` regenera el cliente de Prisma (también lo hace `typecheck`).

Al crear o cambiar un script, actualiza esta lista y `README.md`.

Las credenciales de PostgreSQL viven solo en el `.env` de la raíz. La API construye la URL con `urlBaseDeDatos` (`apps/api/src/config/base-de-datos.ts`); no agregues un `DATABASE_URL` aparte.

## Reglas que no se negocian

1. **Las cantidades salen siempre de `packages/equivalencias`.** Ningún otro código calcula porciones, unidades ni conversiones crudo/cocido. Tampoco la IA (fase 4): la IA propone ideas, el motor pone los números.
2. **`packages/equivalencias` es puro.** Sin base de datos, sin red, sin Nest, sin React, sin efectos. Recibe datos cargados y devuelve resultados. Todo cambio ahí va con pruebas.
3. **Se guarda en unidad canónica, se muestra en medida casera.** Gramos, mililitros o piezas en la base; la medida casera es solo entrada y presentación. El peso canónico es en crudo.
4. **Todo vive en un espacio.** Cada consulta a datos de un espacio se filtra por `espacioId` y pasa por el guard de membresía. Nunca devolver datos de un espacio sin verificar la membresía y el rol.
5. **Los registros guardan el cálculo.** Un ítem registrado guarda sus unidades ya calculadas; editar una equivalencia nunca cambia el historial.
6. **Los planes se versionan.** Ajustar un plan crea una versión nueva; las anteriores no se editan.
7. **Datos de salud:** borrado lógico por defecto; borrado físico solo al eliminar la cuenta. Nunca registrar datos de salud en logs.
8. **Validación compartida:** los esquemas Zod de `packages/shared` validan en la API y en los clientes. No duplicar validaciones a mano.

## Convenciones

- Idioma del dominio: **español sin tildes** para entidades, campos y funciones del dominio (`Plan`, `Comida`, `Equivalencia`, `aUnidades`). Términos técnicos de framework en inglés (`PlanesService`, `PlanesController`, `dto`).
- Comentarios, documentación, mensajes de commit y textos de la interfaz en español.
- Commits pequeños con prefijo convencional: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- Antes de un cambio grande (nuevo módulo, cambio de esquema, cambio de arquitectura), propone un plan y espera confirmación.
- Si una decisión técnica cambia, agrega o actualiza un archivo en `docs/decisiones/`.

## Documentación

Lee el documento que corresponda antes de trabajar en esa área:

- `docs/producto.md` — qué es Vianda, roles, reglas de propiedad y glosario.
- `docs/arquitectura.md` — responsabilidades de cada app y paquete, autenticación, permisos y flujo de datos.
- `docs/modelo-de-datos.md` — entidades, campos, relaciones y reglas del esquema.
- `docs/fase-1.md` — alcance actual, orden de trabajo y criterio de cierre.
- `docs/marca/marca.md` — identidad visual: logos, colores, tipografía y sus usos.
- `docs/decisiones/` — registro de decisiones técnicas y sus razones.
