# 0004. Prisma como ORM

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
Se comparó con TypeORM, que tiene integración oficial con Nest.

## Decisión
Prisma.

## Consecuencias
- Los tipos de cada consulta reflejan exactamente lo que se pidió (`include`, `select`); acceder a una relación no cargada es error de compilación.
- Migraciones generadas de forma predecible con `prisma migrate dev`.
- El esquema vive en `schema.prisma`; hay que regenerar el cliente al cambiarlo.
- La seguridad por fila requiere configurar variables de sesión por transacción; se aborda en la fase 3.
- Los tipos de Prisma no salen de `apps/api`: los clientes usan los tipos de `packages/shared`.
