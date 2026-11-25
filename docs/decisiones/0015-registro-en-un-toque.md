# 0015. Registro en un toque con deshacer, sin confirmación

Estado: Aceptada
Fecha: 2026-11-25

## Contexto
Si registrar cuesta varios pasos, la persona deja de hacerlo y el plan vuelve al papel, que es justo lo que mide el criterio de cierre de la fase 1. Un paso de confirmación protege de errores poco frecuentes a costa de un paso extra en cada registro.

## Decisión
- Tocar una opción de alimento **registra de inmediato** esa unidad, con su alimento y su cantidad, sin diálogo de confirmación.
- Tras cada registro aparece un aviso flotante con "Deshacer" para corregir al instante.
- Durante todo el día, cada registro se puede "Cambiar" o "Quitar".
- Al completar un grupo, la app lo cierra y abre el siguiente grupo pendiente de la comida.

## Consecuencias
- La API necesita operaciones de registro, deshacer, cambio y quitar que sean rápidas e idempotentes ante toques repetidos.
- "Deshacer" y "Quitar" sobre ítems usan el borrado lógico de los registros (regla de datos de salud), no el borrado físico.
- No existen acciones que solo vivan como gesto: "Deshacer", "Cambiar" y "Quitar" son controles visibles.
