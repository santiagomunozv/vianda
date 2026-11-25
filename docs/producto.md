# Producto

Resumen de producto orientado al desarrollo. La versión completa, con diagramas, es el documento de concepto de Vianda.

## Qué resuelve

Un plan por intercambios reparte cada comida del día en grupos de alimentos (proteína, harina, lácteo, fruta, grasa, verdura) y asigna unidades a cada grupo: "en el desayuno te tocan 1 proteína, 2 harinas y 1 lácteo". La persona elige qué alimento cubre cada unidad. Las fricciones que Vianda elimina:

- Calcular porciones: 5 huevos de codorniz equivalen a 1 huevo de gallina; 120 g de carne cruda son 1 unidad de proteína.
- Convertir entre crudo y cocido.
- Saber qué falta por comer en cada comida del plan.
- (Fase 4) Tener ideas de preparaciones con lo que hay en casa.

La pantalla central de la app es **"Hoy"**: la comida actual, las unidades pendientes por grupo y opciones concretas con su cantidad.

## Conceptos

| Término | Significado |
| --- | --- |
| Grupo | Familia de alimentos intercambiables entre sí. Lo define cada tabla de equivalencias y tiene un color propio. |
| Unidad | Porción de referencia de un grupo. El plan dice cuántas van en cada comida. |
| Equivalencia | Cantidad de un alimento que equivale a una unidad de su grupo, dentro de una tabla. |
| Tabla de equivalencias | Conjunto de grupos y equivalencias. Puede heredar de otra y sobrescribir partes. |
| Unidad canónica | Gramo, mililitro o pieza. Así se guarda y se calcula todo. |
| Medida casera | "Una taza", "un filete mediano". Solo para entrada y presentación. |
| Factor de cocción | Relación entre peso cocido y crudo de un alimento. |
| Plan | Comidas del día con las unidades de cada grupo. Se versiona. |
| Comida | Momento del plan ("Desayuno", "Pre-entreno"). Nombre libre, orden y hora opcional; un plan tiene las que necesite. |
| Comida libre | Permiso del plan para reemplazar comidas por otra cosa, con un máximo por semana. |
| Espacio | Lugar donde viven los planes: personal, independiente u organización. |
| Membresía | Relación de un usuario con un espacio, con un rol. |

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

## Cómo se registra

- **Tocar una opción registra** esa unidad con el alimento y su cantidad. Se corrige con "Deshacer" (inmediato) o "Cambiar"/"Quitar" (todo el día). No hay paso de confirmación.
- **"Ya la comí, sin detallar"** registra la unidad sin alimento. Queda visiblemente a medias hasta que se detalla eligiendo una opción.
- **"Comí otra cosa"** reemplaza una comida completa, con una nota opcional ("hamburguesa"). La app la clasifica sola: **comida libre** si el plan lo permite y queda cupo esa semana; si no, **fuera del plan**. El usuario nunca elige la clasificación.
- **"No la comí"** marca la comida como omitida.
- **"Registrar otro alimento"** agrega algo fuera de las opciones; si no cubre una unidad del plan, queda como extra fuera del plan.

## Estados

**De una unidad:** pendiente, detallada o sin detallar.

**De una comida:**

| Estado | Cuándo | Cumplimiento |
| --- | --- | --- |
| Pendiente | El día sigue en curso y no hay registros | — |
| Incompleta | Algunas unidades registradas | Cuentan las registradas |
| Cumplida | Todas las unidades registradas, detalladas o no | Cumplida |
| Comida libre | "Comí otra cosa" con cupo disponible | **Cumplida** (el plan la contempla) |
| Fuera del plan | "Comí otra cosa" sin cupo | No cumplida, pero registrada |
| Omitida | "No la comí" | No cumplida, pero registrada |
| Sin registrar | Terminó el día sin ningún registro | No cumplida y sin información |

## Indicadores

| Indicador | Pregunta que responde | Cálculo |
| --- | --- | --- |
| Cumplimiento | ¿Comí lo que dice el plan? | Unidades cumplidas / unidades planeadas. Se muestra con una barra segmentada por motivo: cumplidas, fuera del plan, omitidas, sin registrar. |
| Detalle | ¿Qué tan precisos son mis datos? | Unidades detalladas / unidades cumplidas |
| Constancia | ¿Estoy usando la app? | Comidas con algún registro (todo menos "sin registrar") / comidas del plan |
| Fuera del plan | ¿Cuánto me salí? | Comidas fuera del plan, extras y comidas libres usadas de las permitidas, por semana |

Separar cumplimiento y constancia distingue "no seguí el plan" de "no registré".

## Sesión

La sesión no se cierra salvo que el usuario lo decida: se renueva sola con cada uso (refresco deslizante de 90 días), el token se guarda cifrado en el dispositivo y se revoca al cerrar sesión, al cambiar la contraseña o con "cerrar sesión en todos los dispositivos". Bloqueo con biometría opcional y desactivado por defecto. En la fase 3, las sesiones de profesionales serán más cortas.

## Funcionalidades por fase

| Fase | Contenido | Criterio para avanzar |
| --- | --- | --- |
| 1. Núcleo | Catálogo editable, plan versionado con comidas flexibles y comidas libres, "Hoy" con sus estados, registro completo (detallado, rápido, comí otra cosa, no la comí), calculadora, resumen del día | Santiago lo usa a diario |
| 2. Seguimiento | Peso y medidas, indicadores semanales, recordatorios, varios usuarios | Lo usan conocidos |
| 3. Profesionales | Nutricionista, organización, invitaciones, consentimientos, auditoría, copia de plan al desvincularse | Piloto validado en un gimnasio |
| 4. Complementos | Despensa, sugerencia de mercado, "acabé de mercar", recetas con IA, publicación en tiendas | — |

Fuera de alcance por ahora: tipos de día dentro de un plan (por ejemplo, día de entreno y de descanso). El modelo debe poder sumarlos después sin romper nada.

## Identidad visual

Colores, tipografía y logo en `docs/marca/marca.md`. Componentes, pantallas y comportamiento en `docs/diseno.md`.

## Restricciones legales

Los datos de peso y salud son datos sensibles bajo la Ley 1581 de 2012 (Colombia). Antes de abrir la app a terceros: consentimiento explícito, política de tratamiento de datos y auditoría de accesos.
