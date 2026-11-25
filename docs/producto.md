# Producto

Resumen de producto orientado al desarrollo. La versión completa, con diagramas, es el documento de concepto de Vianda.

## Qué resuelve

Un plan por intercambios reparte cada comida del día en grupos de alimentos (proteína, harina, lácteo, fruta, grasa, verdura) y asigna unidades a cada grupo: "en el desayuno te tocan 1 proteína, 2 harinas y 1 lácteo". La persona elige qué alimento cubre cada unidad. Las fricciones que Vianda elimina:

- Calcular porciones: 5 huevos de codorniz equivalen a 1 huevo de gallina; 120 g de carne cruda son 1 unidad de proteína.
- Convertir entre crudo y cocido.
- Saber qué falta por comer en cada comida del plan.
- (Fase 4) Tener ideas de preparaciones con lo que hay en casa.

La pantalla central de la app es **"Qué me toca"**: la próxima comida, las unidades pendientes por grupo y opciones concretas con su cantidad.

## Conceptos

| Término | Significado |
| --- | --- |
| Grupo | Familia de alimentos intercambiables entre sí. Lo define cada tabla de equivalencias. |
| Unidad | Porción de referencia de un grupo. El plan dice cuántas van en cada comida. |
| Equivalencia | Cantidad de un alimento que equivale a una unidad de su grupo, dentro de una tabla. |
| Tabla de equivalencias | Conjunto de grupos y equivalencias. Puede heredar de otra y sobrescribir partes. |
| Unidad canónica | Gramo, mililitro o pieza. Así se guarda y se calcula todo. |
| Medida casera | "Una taza", "un filete mediano". Solo para entrada y presentación. |
| Factor de cocción | Relación entre peso cocido y crudo de un alimento. |
| Plan | Reparto de grupos y unidades por comida. Se versiona. |
| Espacio | Lugar donde viven los planes: personal, independiente u organización. |
| Membresía | Relación de un usuario con un espacio, con un rol. |
| Adherencia | Qué tanto se cumple el plan, calculado desde los registros. |

## Roles

- **Usuario autónomo:** registra y edita su propio plan en su espacio personal.
- **Usuario vinculado (paciente):** recibe el plan de un nutricionista; no puede editarlo ni proponer cambios. Registra consumo y progreso, y decide qué comparte.
- **Nutricionista:** crea planes y hace seguimiento. Una sola cuenta con membresía en su espacio independiente y en cada organización donde trabaja.
- **Organización (admin):** gimnasio o clínica. Administra nutricionistas y miembros.
- **Administración de la plataforma:** catálogo base global, alta de organizaciones, auditoría.

## Reglas de propiedad

La regla general: **lo que vive en un espacio es del dueño del espacio**, excepto los datos personales del usuario, que siempre son suyos.

- Los miembros de un gimnasio y los planes creados ahí son del gimnasio.
- Si un nutricionista sale de un gimnasio, se cierra su membresía en ese espacio; conserva su cuenta y su espacio independiente. No puede exportar ni contactar a los miembros del gimnasio.
- Los traslados entre nutricionistas los inicia siempre el usuario.
- Peso, registros y progreso son del usuario y lo acompañan a donde vaya.
- Al terminar una membresía de paciente, el plan vigente se copia al espacio personal del usuario como plan editable, **con las notas del nutricionista** y con referencia a su origen (plan, nutricionista, organización, fecha). El original queda en el espacio de la organización.

## Funcionalidades por fase

| Fase | Contenido | Criterio para avanzar |
| --- | --- | --- |
| 1. Núcleo | Catálogo editable, plan manual versionado, "Qué me toca", calculadora, marcar lo comido | Santiago lo usa a diario |
| 2. Seguimiento | Peso y medidas, progreso y adherencia, recordatorios, varios usuarios | Lo usan conocidos |
| 3. Profesionales | Nutricionista, organización, invitaciones, consentimientos, auditoría, copia de plan al desvincularse | Piloto validado en un gimnasio |
| 4. Complementos | Despensa, sugerencia de mercado, "acabé de mercar", recetas con IA, publicación en tiendas | — |

## Identidad visual

- Símbolo: una V en forma de cuenco que sostiene un huevo.
- Color principal `#12355B` (azul marino). Acento `#1C93A6` sobre fondos claros, `#7FD3DF` sobre fondos oscuros. Fondo suave `#EEF3F8`.
- Tipografía: Manrope. El nombre se escribe "vianda", en minúscula, peso 700.
- Tono: profesional y clínico, cercano con el usuario.
- Archivos, tokens completos y usos: `docs/marca/marca.md`.

## Restricciones legales

Los datos de peso y salud son datos sensibles bajo la Ley 1581 de 2012 (Colombia). Antes de abrir la app a terceros: consentimiento explícito, política de tratamiento de datos y auditoría de accesos.
