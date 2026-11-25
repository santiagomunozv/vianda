# Fase 1: Núcleo

## Objetivo

Que Santiago pueda configurar su catálogo y su plan en la web, y usar la app móvil a diario para saber qué le toca comer, cuánto es cada porción y registrar lo que comió.

**Criterio de cierre:** Santiago usa Vianda a diario durante dos semanas sin volver al papel del plan.

## Alcance

**Incluye**

- Registro e inicio de sesión con correo y contraseña, en app y web, con sesión persistente (ver `docs/producto.md`, "Sesión"). En el móvil, tokens en `expo-secure-store`.
- Espacio personal creado automáticamente al registrarse.
- **Web:**
  - Home "Mi plan" y pantalla de primera vez con tres pasos.
  - Catálogo: tabla propia que hereda de la global, grupos con color, alimentos, medidas caseras, equivalencias y factores de cocción, con el origen visible (Base, Propio, Modificado).
  - Constructor del plan: comidas flexibles (cantidad, nombre, orden y hora opcional), porciones por grupo, comidas libres por semana, notas; guardar crea una versión.
- **App:**
  - "Hoy" con franja de comidas, anillo de avance y grupos en acordeón con apertura automática.
  - Estados de "Hoy": comida actual, entre comidas, día completo y primera vez.
  - Registro: tocar una opción, "Ya la comí, sin detallar", detallar después, "Comí otra cosa" (con clasificación libre o fuera del plan), "No la comí", "Registrar otro alimento", "Deshacer", "Cambiar" y "Quitar".
  - Calculadora con sus dos modos.
  - Resumen del día con cumplimiento desglosado y detalle.

**No incluye** (fases siguientes): peso y medidas, indicadores semanales, recordatorios, biometría, roles de nutricionista y organización, invitaciones, consentimientos, auditoría, seguridad por fila, tipos de día, despensa, mercado, IA.

El esquema sí incluye desde ya `Espacio` y `Membresia`, aunque solo se use el espacio personal.

Diseño de todas las pantallas: `docs/diseno.md`, con capturas en `docs/diseno/`.

## Orden de trabajo

Cada paso termina con pruebas pasando y un commit.

1. ~~**Scaffolding del monorepo.**~~ Completado.
2. **`packages/equivalencias` con pruebas primero.** Tipos del dominio, `resolverTabla`, `aUnidades`, `desdeUnidades`, `pendientes`, estado de una comida, clasificación de "comí otra cosa" y los indicadores del día. Casos mínimos: conversión directa, medias unidades, crudo a cocido con factor, alimento sin factor, herencia que sobrescribe, alimento ausente, unidad sin detallar, comida libre con y sin cupo, comida omitida, extras que no suman.
3. **`packages/shared`.** Enums y esquemas Zod para catálogo, plan y registro.
4. **Esquema Prisma y migración inicial** según `docs/modelo-de-datos.md` (tablas de fase 1). Seed con la tabla global (grupos base con sus colores, sin equivalencias) y un usuario de desarrollo.
5. **Autenticación en la API.** Registro (crea espacio personal y membresía `DUENO`), inicio de sesión, refresco deslizante con rotación, cierre de sesión y cierre en todos los dispositivos. Guard de membresía.
6. **API del catálogo.** CRUD de tablas, grupos, alimentos, medidas caseras y equivalencias, más la tabla efectiva resuelta con el origen de cada equivalencia.
7. **Sistema visual compartido.** Tokens de `docs/marca/marca.md` en web y móvil, tipografías y los componentes base de `docs/diseno.md` (puntos, cuadrito de grupo, botones, campos, tarjetas).
8. **Web: inicio de sesión, primera vez y catálogo.**
9. **API de planes.** Crear plan, crear versión, consultar la versión vigente con comidas, porciones y comidas libres.
10. **Web: Mi plan y constructor del plan.**
11. **API de registros.** Registrar, detallar, quitar y deshacer ítems; "comí otra cosa" con clasificación; "no la comí"; extras; estado de las comidas y resumen de un día.
12. **Móvil: inicio de sesión, Hoy con todos sus estados, registro completo y resumen del día.**
13. **Móvil: calculadora.**
14. **Carga del plan real** de Santiago y prueba de uso diario.

## Notas

- Si durante la fase aparece una necesidad que el modelo no cubre, propón el cambio de esquema antes de implementarlo y regístralo en `docs/decisiones/`.
- Los textos de la interfaz siguen la sección "Textos" de `docs/diseno.md`: tono neutro, sin reproches.
