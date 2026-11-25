# 0017. Comidas flexibles y comida libre con clasificación automática guardada

Estado: Aceptada
Fecha: 2026-11-25

## Contexto
Los planes reales no tienen siempre las mismas comidas: algunos tienen tres, otros seis, con nombres como "Pre-entreno". Muchos permiten además una o varias comidas libres por semana. Si el usuario eligiera cómo clasificar lo que comió, el registro se volvería una negociación consigo mismo.

## Decisión
- **Comidas flexibles:** una versión del plan tiene las comidas que necesite, cada una con nombre libre, `orden` y `horaSugerida` opcional. Sin horas, "Hoy" usa el orden.
- **Comida libre:** `VersionPlan.comidasLibresPorSemana` (0 por defecto) define el cupo semanal, de lunes a domingo en la zona horaria del usuario.
- "Comí otra cosa" crea un `RegistroComida` con resultado `OTRA_COSA` y una nota opcional. La app lo clasifica sola: `LIBRE` si queda cupo esa semana y `FUERA_DEL_PLAN` si no. **El usuario nunca elige la clasificación.**
- La clasificación la calcula `packages/equivalencias` y **se guarda al registrar**, para que el historial no cambie si después se ajusta el plan.
- Si se elimina o cambia una comida libre, se recalcula la clasificación de las demás de esa semana.

## Consecuencias
- Una comida libre cuenta como cumplida: el plan la contempla.
- La API debe recalcular y guardar en una sola transacción las clasificaciones de la semana afectada.
- Los textos informan sin juzgar: "Contará como tu comida libre de esta semana" o "quedará como fuera del plan. Se registra igual."
- Los tipos de día (entreno y descanso) siguen fuera de alcance; se agregarían entre `VersionPlan` y `Comida`.
