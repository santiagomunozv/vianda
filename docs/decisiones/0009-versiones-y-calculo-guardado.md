# 0009. Planes versionados y cálculo guardado en los registros

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
Los planes se ajustan con el tiempo y las equivalencias pueden editarse. La adherencia pasada debe medirse contra lo que estaba vigente.

## Decisión
- Ajustar un plan crea una `VersionPlan` nueva; las versiones publicadas no se editan.
- Cada `ItemRegistro` guarda su grupo y sus unidades ya calculadas.

## Consecuencias
- El historial nunca cambia de forma retroactiva.
- La adherencia de cualquier fecha se calcula contra la versión vigente en esa fecha.
- Copiar un plan al terminar una membresía es copiar su versión vigente.
