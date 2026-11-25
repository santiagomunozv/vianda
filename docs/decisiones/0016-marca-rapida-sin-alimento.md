# 0016. Marca rápida como ítem sin alimento

Estado: Aceptada
Fecha: 2026-11-25

## Contexto
A veces la persona sabe que comió la unidad pero no quiere o no puede decir qué fue en ese momento. Sin una forma rápida de marcarla, o no registra o inventa un alimento, y las dos cosas dañan los datos.

## Decisión
- "Ya la comí, sin detallar" crea un `ItemRegistro` con `grupoId` y `unidades`, **sin `alimentoId` ni `cantidadCanonica`**.
- La unidad cuenta como cumplida, pero queda visiblemente a medias (punto relleno a medias) hasta que se detalla.
- Detallar es **completar el mismo ítem** con `alimentoId` y `cantidadCanonica`, no crear otro.
- El indicador **detalle** (unidades detalladas / unidades registradas en comidas del plan) mide cuánto se ha detallado, separado del cumplimiento.

## Consecuencias
- `alimentoId` y `cantidadCanonica` son opcionales en `ItemRegistro`. La validación de `packages/shared` debe exigir los dos juntos o ninguno.
- Las unidades de una marca rápida no salen de `aUnidades`, porque no hay alimento: son las unidades de la porción que se marca. Al detallarla, las unidades sí se calculan con el motor.
- La interfaz pide detallar sin reprochar ("Detallado: 14 de 15", "Detallar").
