# 0001. Monorepo con pnpm y Turborepo

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
Vianda tiene una API, una web y una app móvil que comparten tipos, validaciones y la lógica de cálculo de porciones. Hay un solo desarrollador.

## Decisión
Un único repositorio con pnpm workspaces y Turborepo: `apps/api`, `apps/web`, `apps/mobile`, `packages/shared`, `packages/equivalencias`.

## Consecuencias
- Un cambio en un contrato o en el motor se ve de inmediato en las tres apps.
- Expo requiere configuración inicial del empaquetador (Metro) para resolver paquetes del monorepo.
- Si en el futuro hay equipos separados con despliegues independientes, se puede reevaluar.
