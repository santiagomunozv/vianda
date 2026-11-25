# 0006. Motor de equivalencias como paquete puro

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
El cálculo de porciones es la pieza más crítica de Vianda y se necesita en la API, la web y la app móvil, incluso sin conexión.

## Decisión
`packages/equivalencias` es TypeScript puro: sin base de datos, red, frameworks ni efectos. Recibe datos cargados y devuelve resultados. Es el único lugar donde se calculan porciones.

## Consecuencias
- Una sola fuente de verdad para todos los cálculos.
- Se prueba a fondo con pruebas unitarias simples.
- La app móvil calcula localmente.
- La IA (fase 4) no calcula cantidades: usa este paquete.
