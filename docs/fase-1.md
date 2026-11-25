# Fase 1: Núcleo

## Objetivo

Que Santiago pueda configurar su catálogo y su plan en la web, y usar la app móvil a diario para saber qué le toca comer y cuánto es cada porción.

**Criterio de cierre:** Santiago usa Vianda a diario durante dos semanas sin volver al papel del plan.

## Alcance

**Incluye**

- Registro e inicio de sesión con correo y contraseña. Un usuario real, pero sin limitar el código a uno solo.
- Espacio personal creado automáticamente al registrarse.
- Catálogo editable en la web: tabla de equivalencias propia que hereda de la tabla global, grupos, alimentos, medidas caseras, equivalencias y factores de cocción.
- Constructor del plan en la web: comidas del día, porciones por grupo y notas, con versiones.
- App móvil:
  - **Qué me toca:** la comida actual o próxima según la hora, sus porciones y lo que falta por grupo.
  - **Calculadora:** elegir un alimento y ver cuánto es una unidad, en crudo, en cocido y en medidas caseras; o ingresar una cantidad y ver cuántas unidades son.
  - **Marcar lo comido:** registrar alimentos de una comida; las unidades se calculan y se descuentan de lo pendiente.

**No incluye** (fases siguientes): peso y medidas, gráficas de progreso, recordatorios, roles de nutricionista y organización, invitaciones, consentimientos, auditoría, seguridad por fila, despensa, mercado, IA.

El esquema sí incluye desde ya `Espacio` y `Membresia`, aunque solo se use el espacio personal.

## Orden de trabajo

Cada paso termina con pruebas pasando y un commit.

1. **Scaffolding del monorepo.** pnpm workspaces, Turborepo, TypeScript estricto compartido, ESLint y Prettier, Docker Compose con PostgreSQL, las cinco carpetas de apps y paquetes, y los scripts de `CLAUDE.md`.
2. **`packages/equivalencias` con pruebas primero.** Tipos del dominio, `resolverTabla`, `aUnidades`, `desdeUnidades`, `pendientes`. Casos de prueba mínimos: conversión directa, medias unidades, crudo a cocido con factor, alimento sin factor de cocción, herencia que sobrescribe una equivalencia, alimento ausente en la tabla.
3. **`packages/shared`.** Enums y esquemas Zod para catálogo, plan y registro.
4. **Esquema Prisma y migración inicial** según `docs/modelo-de-datos.md` (tablas de fase 1). Seed con: tabla global con los grupos base vacíos de equivalencias, y un usuario de desarrollo.
5. **Autenticación en la API.** Registro (crea espacio personal y membresía `DUENO`), inicio de sesión, refresco y cierre de sesión. Guard de membresía.
6. **API del catálogo.** CRUD de tablas, grupos, alimentos, medidas caseras y equivalencias, más un endpoint que devuelve la tabla efectiva resuelta.
7. **Web: inicio de sesión y catálogo.** Pantallas para gestionar todo el catálogo.
8. **API de planes.** Crear plan, crear versión, consultar versión vigente con comidas y porciones.
9. **Web: constructor del plan.** Editar comidas y porciones; guardar crea una nueva versión.
10. **API de registros.** Registrar ítems (calculando con `equivalencias`) y consultar pendientes de una fecha.
11. **Móvil: inicio de sesión, Qué me toca, calculadora y marcar lo comido.**
12. **Carga del plan real** de Santiago en el catálogo y el plan, y prueba de uso diario.

## Notas

- La identidad visual (colores, tipografía) está en `docs/producto.md`; úsala desde el primer componente para no tener que retocar después.
- Si durante la fase aparece una necesidad que el modelo no cubre, propón el cambio de esquema antes de implementarlo y regístralo en `docs/decisiones/`.
