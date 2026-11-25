# 0018. Estados e indicadores derivados

Estado: Aceptada
Fecha: 2026-11-25

## Contexto
Un solo porcentaje de adherencia mezcla cosas distintas: no comer lo del plan, comer otra cosa y no registrar. Para la persona y, más adelante, para su nutricionista, esas situaciones significan cosas diferentes.

## Decisión
- El **estado de una comida** (pendiente, incompleta, cumplida, comida libre, fuera del plan, omitida, sin registrar) y los **indicadores** **no se guardan**: se derivan en `packages/equivalencias` a partir de la versión vigente y de los registros. Lo único que se guarda es lo que el usuario hizo, y la clasificación de "comí otra cosa" (decisión 0017).
- **Cumplimiento** = unidades cumplidas / unidades planeadas, siempre **desglosado** por motivo: cumplidas, fuera del plan, omitidas y sin registrar. Se muestra con una barra segmentada.
- **Detalle** = unidades detalladas / unidades registradas en comidas del plan.
- **Constancia** = comidas con algún registro / comidas planeadas del período, sin contar las pendientes del día en curso.
- **Fuera del plan** = comidas fuera del plan más extras, y comidas libres usadas frente a permitidas por semana.
- Las definiciones exactas están en `docs/modelo-de-datos.md`, sección 5.

## Consecuencias
- Separar cumplimiento y constancia distingue "no seguí el plan" de "no registré".
- Cambiar una definición cambia los indicadores pasados sin migrar datos, porque son derivados. Los datos de origen sí son históricos (decisión 0009).
- El motor recibe como datos el contexto temporal (fecha, si el día terminó, semana) y nunca lee el reloj.
- En la fase 1 se usan los indicadores del día; los semanales llegan en la fase 2 con las mismas funciones.
