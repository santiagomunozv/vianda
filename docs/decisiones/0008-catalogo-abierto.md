# 0008. Catálogo de equivalencias con configuración abierta

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
Las tablas de intercambios varían entre nutricionistas. Se evaluó esperar el plan real de Santiago y modelar a partir de él.

## Decisión
Grupos, alimentos, medidas caseras y equivalencias se crean y editan libremente. Las tablas pueden heredar de otra y sobrescribir partes. La relación alimento–grupo vive en la equivalencia, por tabla. El plan real de Santiago será el primer conjunto de datos, no la estructura.

## Consecuencias
- El modelo soporta desde el inicio a cualquier nutricionista u organización.
- La resolución de la herencia vive en `packages/equivalencias`.
- La web de configuración de la fase 1 es la base del portal profesional de la fase 3.
