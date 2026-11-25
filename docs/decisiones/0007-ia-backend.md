# 0007. La IA vive solo en el backend

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
La fase 4 usa IA para proponer recetas e interpretar textos de compras.

## Decisión
Un módulo `ia` en `apps/api`, detrás de una interfaz propia (lo que Vianda necesita) con un adaptador por proveedor.

## Consecuencias
- Las llaves de proveedores nunca llegan a los clientes; costos y límites se controlan en un solo lugar.
- Cambiar de proveedor o modelo solo cambia el adaptador.
- La IA devuelve ideas o listas de alimentos; las cantidades las pone `packages/equivalencias`.
