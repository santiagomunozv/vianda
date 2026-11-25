# Modelo de datos

PostgreSQL con Prisma. Este documento define entidades, campos clave y reglas; el `schema.prisma` se escribe a partir de aquí. La columna "Fase" indica cuándo se crea la tabla.

## Reglas generales

- Identificadores UUID.
- Todas las tablas llevan `creadoEn` y `actualizadoEn`.
- Las tablas con datos de salud llevan `eliminadoEn` (borrado lógico). El borrado físico solo ocurre al eliminar la cuenta.
- Cantidades en **unidad canónica**: gramos, mililitros o piezas, siempre del alimento en **crudo**. Tipo `Decimal(10,2)`.
- Unidades de un grupo: `Decimal(6,2)`, porque existen medias unidades.
- Toda entidad que pertenece a un espacio lleva `espacioId` y se filtra por él.
- Las fechas de registro (`fecha`) son días calendario en la zona horaria del usuario. La semana va de lunes a domingo.

## Enums

| Enum | Valores |
| --- | --- |
| `TipoEspacio` | `PERSONAL`, `INDEPENDIENTE`, `ORGANIZACION` |
| `RolMembresia` | `DUENO`, `ADMIN`, `NUTRICIONISTA`, `PACIENTE` |
| `EstadoMembresia` | `ACTIVA`, `CERRADA` |
| `MedidaCanonica` | `GRAMO`, `MILILITRO`, `PIEZA` |
| `EstadoCoccion` | `CRUDO`, `COCIDO` |
| `EstadoPlan` | `ACTIVO`, `ARCHIVADO` |
| `Objetivo` | `BAJAR_GRASA`, `GANAR_MUSCULO`, `MANTENER` |
| `ResultadoComida` | `PLAN`, `OTRA_COSA`, `OMITIDA` |
| `ClasificacionReemplazo` | `LIBRE`, `FUERA_DEL_PLAN` |

## 1. Identidad y espacios

| Entidad | Campos clave | Fase |
| --- | --- | --- |
| `Usuario` | `email` (único), `hashContrasena`, `nombre`, `zonaHoraria` (por defecto `America/Bogota`), `objetivo?`, `alergias` (texto[]), `preferencias` (JSON), `esAdminPlataforma` | 1 |
| `SesionRefresco` | `usuarioId`, `hashToken`, `dispositivo?`, `ultimoUsoEn`, `expiraEn`, `revocadoEn?` | 1 |
| `Organizacion` | `nombre`, `nit?`, `espacioId` (único) | 3 |
| `Espacio` | `tipo`, `nombre`, `propietarioId?` (usuario, para personal e independiente) | 1 |
| `Membresia` | `usuarioId`, `espacioId`, `rol`, `estado`, `inicio`, `fin?` | 1 |

Reglas:

- Al registrarse, cada usuario recibe automáticamente su espacio `PERSONAL` y una membresía `DUENO` en él.
- Un usuario puede tener varias membresías; una sola activa por par usuario–espacio–rol.
- Cerrar una membresía nunca borra datos: solo cambia `estado` y llena `fin`.
- Sesión deslizante: cada refresco rota el token, actualiza `ultimoUsoEn` y extiende `expiraEn` 90 días. Cambiar la contraseña o "cerrar sesión en todos los dispositivos" revoca todas las sesiones del usuario.

## 2. Catálogo de equivalencias

| Entidad | Campos clave | Fase |
| --- | --- | --- |
| `TablaEquivalencias` | `nombre`, `espacioId?` (nulo = tabla global), `baseId?` (tabla de la que hereda) | 1 |
| `Grupo` | `tablaId`, `nombre`, `color` (hex de la paleta de `docs/marca/marca.md`), `orden` | 1 |
| `Alimento` | `nombre`, `medidaCanonica`, `factorCoccion?`, `espacioId?` (nulo = global) | 1 |
| `MedidaCasera` | `alimentoId`, `nombre` ("taza", "filete mediano"), `cantidadCanonica`, `estado` | 1 |
| `Equivalencia` | `tablaId`, `alimentoId`, `grupoId`, `cantidadPorUnidad`, `factorCoccion?` | 1 |

Reglas:

- El **grupo de un alimento depende de la tabla**: la relación alimento–grupo vive en `Equivalencia`, no en `Alimento`.
- `Equivalencia` es única por (`tablaId`, `alimentoId`).
- Herencia: la tabla efectiva es la cadena `base → hija`, donde la hija sobrescribe las equivalencias de los mismos alimentos y puede usar grupos de su cadena. La resolución la hace `packages/equivalencias`, no la base de datos.
- `cantidadPorUnidad` está en unidad canónica y en crudo.
- `factorCoccion` = peso cocido / peso crudo. El de `Equivalencia` sobrescribe al de `Alimento`. Si no hay ninguno, el alimento no admite conversión a cocido.
- El origen que muestra el catálogo (Base, Propio, Modificado) se deriva: Base si la equivalencia viene de una tabla de la cadena; Propio si el alimento es del espacio; Modificado si la tabla del espacio sobrescribe una equivalencia heredada.

## 3. Planes

| Entidad | Campos clave | Fase |
| --- | --- | --- |
| `Plan` | `espacioId`, `pacienteId` (usuario), `tablaId`, `autorId`, `nombre`, `estado`, `origenPlanId?`, `origenDescripcion?` | 1 |
| `VersionPlan` | `planId`, `numero`, `vigenteDesde`, `comidasLibresPorSemana` (entero, 0 por defecto), `notas?`, `creadaPorId` | 1 |
| `Comida` | `versionId`, `nombre`, `orden`, `horaSugerida?`, `notas?` | 1 |
| `PorcionPlan` | `comidaId`, `grupoId`, `unidades` | 1 |
| `PlantillaPlan` | igual que `Plan` sin paciente; se instancia en planes | 3 |

Reglas:

- Una versión nunca se edita después de publicada. Ajustar el plan = crear la versión `numero + 1`, copiando y modificando.
- La versión vigente en una fecha es la de mayor `vigenteDesde` menor o igual a esa fecha.
- Un paciente tiene como máximo un plan `ACTIVO` por espacio.
- Una versión tiene las comidas que necesite (no hay número fijo). `horaSugerida` es opcional; sin horas, "Hoy" usa el `orden`.
- Copia al terminar una membresía de paciente (fase 3): se crea un `Plan` nuevo en el espacio personal con la versión vigente y sus notas, `origenPlanId` apuntando al original y `origenDescripcion` con nutricionista, organización y fecha.
- Futuro (no en fase 1): tipos de día dentro de una versión (por ejemplo, entreno y descanso). Se agregarían como un nivel entre `VersionPlan` y `Comida`; un plan simple equivaldría a un solo tipo de día.

## 4. Registros y progreso

| Entidad | Campos clave | Fase |
| --- | --- | --- |
| `RegistroComida` | `usuarioId`, `fecha` (date), `comidaId`, `resultado`, `clasificacion?`, `nota?`, `eliminadoEn?` | 1 |
| `ItemRegistro` | `registroId`, `grupoId?`, `alimentoId?`, `cantidadCanonica?` (crudo), `estadoIngresado?`, `unidades`, `esExtra` | 1 |
| `Medicion` | `usuarioId`, `tipo` (peso, cintura…), `valor`, `unidad`, `fecha`, `eliminadoEn?` | 2 |

Reglas:

- `RegistroComida` es único por (`usuarioId`, `fecha`, `comidaId`). Se crea con el primer registro de esa comida ese día.
- `resultado`:
  - `PLAN`: la comida se registra con ítems por unidad.
  - `OTRA_COSA`: se comió otra cosa en lugar de la comida. No lleva ítems del plan; `nota` guarda lo que el usuario escribió.
  - `OMITIDA`: no se comió.
- `clasificacion` solo aplica a `OTRA_COSA` y **se calcula y guarda al registrar**: `LIBRE` si la versión vigente tiene `comidasLibresPorSemana` mayor que las comidas `LIBRE` ya registradas esa semana; si no, `FUERA_DEL_PLAN`. Se guarda para que el historial no cambie si después se ajusta el plan. Si se elimina o cambia una comida libre, se recalcula la clasificación de las demás de esa semana.
- `ItemRegistro` de una unidad del plan: `grupoId` y `unidades` obligatorios.
  - Con `alimentoId` y `cantidadCanonica`: unidad **detallada**. `unidades` sale de `packages/equivalencias`.
  - Sin `alimentoId`: unidad **sin detallar** (marca rápida). Detallarla es completar `alimentoId` y `cantidadCanonica` en el mismo ítem.
- `ItemRegistro` con `esExtra = true`: alimento registrado con "Registrar otro alimento" que no cubre unidades del plan. Cuenta como fuera del plan; no suma al cumplimiento.
- Los ítems guardan el **resultado del cálculo** (`grupoId`, `unidades`). Cambiar una equivalencia después no altera registros pasados.
- `estadoIngresado` recuerda si el usuario lo ingresó crudo o cocido, solo para mostrarlo igual.

## 5. Estados e indicadores (derivados, no se guardan)

Se calculan en `packages/equivalencias` a partir de la versión vigente y los registros.

**Estado de una comida en una fecha:**

| Estado | Condición |
| --- | --- |
| Pendiente | Sin `RegistroComida` y el día no ha terminado |
| Sin registrar | Sin `RegistroComida` y el día terminó |
| Incompleta | `PLAN` con unidades registradas menores que las planeadas |
| Cumplida | `PLAN` con todas las unidades registradas (detalladas o no) |
| Comida libre | `OTRA_COSA` + `LIBRE` |
| Fuera del plan | `OTRA_COSA` + `FUERA_DEL_PLAN` |
| Omitida | `OMITIDA` |

**Indicadores de un período:**

- **Cumplimiento** = unidades cumplidas / unidades planeadas. Cumplidas: unidades registradas en comidas `PLAN` (sin contar extras) más todas las unidades planeadas de las comidas libres. Se reporta desglosado: cumplidas, fuera del plan, omitidas, sin registrar.
- **Detalle** = unidades detalladas / unidades registradas en comidas `PLAN`.
- **Constancia** = comidas con `RegistroComida` / comidas planeadas del período (excluyendo las pendientes del día en curso).
- **Fuera del plan** = comidas `FUERA_DEL_PLAN` + ítems extra; y comidas libres usadas / permitidas por semana.

## 6. Vínculos y consentimiento (fase 3)

| Entidad | Campos clave |
| --- | --- |
| `Invitacion` | `espacioId`, `rol`, `codigo` (único), `expiraEn`, `usadaPorId?`, `usadaEn?` |
| `Consentimiento` | `membresiaId`, `compartePeso`, `comparteRegistros`, `comparteMediciones`, `actualizadoEn` |

## 7. Auditoría (fase 3)

| Entidad | Campos clave |
| --- | --- |
| `AccesoAuditado` | `actorId`, `usuarioObjetivoId`, `espacioId`, `recurso`, `accion`, `fecha` |

Solo inserción: sin actualizaciones ni borrados, también a nivel de permisos de base de datos.

## Fase 4 (pendiente de diseño detallado)

`Despensa`, `ItemDespensa`, `Compra`, `Receta`. Se diseñan al iniciar la fase 4, respetando que toda cantidad pase por `packages/equivalencias`.
