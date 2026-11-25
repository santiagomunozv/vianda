# 0003. PostgreSQL como base de datos

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
Se evaluó MariaDB, donde Santiago tiene más experiencia. El modelo es relacional y funcionaría en ambos.

## Decisión
PostgreSQL.

## Consecuencias
- Seguridad por fila (row level security) disponible como segunda capa de aislamiento entre espacios para datos de salud.
- JSON indexable (JSONB) para campos flexibles como preferencias.
- Opciones administradas con capa gratuita para empezar.
- Curva de aprendizaje baja: el ORM oculta la mayoría de diferencias.
