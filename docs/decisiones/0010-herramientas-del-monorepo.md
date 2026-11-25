# 0010. Herramientas del monorepo y paquetes internos compilados

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
`packages/shared` y `packages/equivalencias` se consumen desde tres entornos distintos: la API (Nest 12, ESM sobre Node), la web (Vite) y la app móvil (Metro para el bundle y Jest con `jest-expo` para las pruebas, que carga CommonJS). Además, varias herramientas recientes no son compatibles entre sí en sus últimas versiones mayores.

## Decisión
- **Paquetes internos compilados con tsup** a `dist`, en formato dual ESM y CJS, con declaraciones de tipos para cada formato. El campo `exports` declara `types` tanto en `import` (`index.d.ts`) como en `require` (`index.d.cts`).
- **Orden de arranque en desarrollo:** `pnpm dev` compila primero los paquetes (`turbo run build --filter=./packages/*`) y después lanza `turbo run dev`, donde los paquetes siguen en `tsup --watch`. En modo watch tsup no limpia `dist`, para que las apps nunca vean la carpeta vacía mientras se recompila.
- **TypeScript estricto compartido** en `tsconfig.base.json`, con `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`. Esta última es obligatoria en `packages/*`. En una app solo se desactiva si genera fricción real con Prisma, Zod o Expo, y en ese caso se anota aquí. Al cerrar el scaffolding no hizo falta desactivarla en ninguna.
- **Versiones fijadas por compatibilidad:**
  - TypeScript `~6.0`: typescript-eslint admite hasta `<6.1` y el CLI de Nest 12 usa 6.0. TypeScript 7 queda pendiente hasta que typescript-eslint lo soporte.
  - ESLint 10 con una sola configuración en la raíz (`eslint.config.mjs`). No se usa `eslint-plugin-react` porque no soporta ESLint 10; se usa `eslint-plugin-react-hooks`. Los generadores de cada app (oxlint, Prettier propio) se eliminaron para que mande la configuración de la raíz.
  - Prisma 7 estable, no la 8 en RC.
  - pnpm 12, fijado en `packageManager` y activado con corepack. Los scripts de instalación permitidos se listan en `allowBuilds` de `pnpm-workspace.yaml`; las *skills* de agente que trae `dotenv` están denegadas.
- **PostgreSQL 17** en desarrollo. La versión se igualará a la de producción cuando se elija proveedor.

## Consecuencias
- Un solo formato compilado sirve a los tres entornos sin configuración de transpilación por herramienta.
- Cambiar un paquete requiere que su watch recompile. La API en `nest start --watch` no se reinicia sola cuando cambia el `dist` de un paquete: hay que guardar un archivo de la API o reiniciarla.
- Al subir TypeScript, ESLint o Prisma de versión mayor hay que revisar esta decisión.
