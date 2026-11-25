# 0012. API sobre Nest 12: ESM, Vitest y sin telemetría externa

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
`docs/arquitectura.md` preveía Jest en la API por ser el estándar de Nest. El generador de Nest 12 crea proyectos solo ESM, con Vitest como corredor de pruebas, oxlint como linter y el módulo `@nestjs/observe`, que envía trazas, logs y errores a un servicio externo.

## Decisión
- La API es ESM: los imports relativos terminan en `.js` (`module: NodeNext`).
- La API usa **Vitest**, igual que los paquetes y la web. El motivo original para elegir Jest (seguir el estándar de Nest) ahora apunta a Vitest. Las pruebas unitarias viven junto al código como `*.spec.ts` y las e2e en `test/*.e2e-spec.ts`.
- Se eliminó `@nestjs/observe`. Enviar logs y trazas de la API a terceros choca con la regla de no registrar datos de salud en logs. Cualquier observabilidad futura se decide aparte, con control explícito de qué se envía.
- La app móvil sigue con Jest mediante `jest-expo`, que es el estándar de Expo. Su script usa `--ci --watchman=false`: con watchman inaccesible, Jest termina con código 0 sin ejecutar pruebas.

## Consecuencias
- Un solo corredor de pruebas (Vitest) en todo el código TypeScript que no es de React Native.
- Los mocks de la API usan `vi.fn()`, no `jest.fn()`.
