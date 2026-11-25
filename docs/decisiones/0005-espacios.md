# 0005. El espacio como concepto central de propiedad

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
Hay usuarios autónomos, nutricionistas independientes y organizaciones, con reglas de propiedad distintas sobre pacientes, planes y datos.

## Decisión
Todo plan, catálogo propio y recurso profesional vive en un `Espacio` de tipo `PERSONAL`, `INDEPENDIENTE` u `ORGANIZACION`. Los usuarios se relacionan con los espacios mediante `Membresia` con un rol.

## Consecuencias
- Las reglas de propiedad se reducen a una: lo que vive en un espacio es de su dueño. Los datos personales del usuario son siempre suyos.
- Un nutricionista que sale de un gimnasio solo cierra esa membresía.
- Toda consulta se filtra por `espacioId` y pasa por el guard de membresía.
