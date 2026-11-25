# Modelo de datos

PostgreSQL con Prisma. Este documento define entidades, campos clave y reglas; el `schema.prisma` se escribe a partir de aquí. La columna "Fase" indica cuándo se crea la tabla.

## Reglas generales

- Identificadores UUID.
- Todas las tablas llevan `creadoEn` y `actualizadoEn`.
- Las tablas con datos de salud llevan `eliminadoEn` (borrado lógico). El borrado físico solo ocurre al eliminar la cuenta.
- Cantidades en **unidad canónica**: gramos, mililitros o piezas, siempre del alimento en **crudo**. Tipo `Decimal(10,2)`.
- Unidades de un grupo: `Decimal(6,2)`, porque existen medias unidades.
- Toda entidad que pertenece a un espacio lleva `espacioId` y se filtra por él.

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

## 1. Identidad y espacios

| Entidad | Campos clave | Fase |
| --- | --- | --- |
| `Usuario` | `email` (único), `hashContrasena`, `nombre`, `objetivo?`, `alergias` (texto[]), `preferencias` (JSON), `esAdminPlataforma` | 1 |
| `SesionRefresco` | `usuarioId`, `hashToken`, `expiraEn`, `revocadoEn?` | 1 |
| `Organizacion` | `nombre`, `nit?`, `espacioId` (único) | 3 |
| `Espacio` | `tipo`, `nombre`, `propietarioId?` (usuario, para personal e independiente) | 1 |
| `Membresia` | `usuarioId`, `espacioId`, `rol`, `estado`, `inicio`, `fin?` | 1 |

Reglas:

- Al registrarse, cada usuario recibe automáticamente su espacio `PERSONAL` y una membresía `DUENO` en él.
- Un usuario puede tener varias membresías; una sola activa por par usuario–espacio–rol.
- Cerrar una membresía nunca borra datos: solo cambia `estado` y llena `fin`.

## 2. Catálogo de equivalencias

| Entidad | Campos clave | Fase |
| --- | --- | --- |
| `TablaEquivalencias` | `nombre`, `espacioId?` (nulo = tabla global), `baseId?` (tabla de la que hereda) | 1 |
| `Grupo` | `tablaId`, `nombre`, `orden` | 1 |
| `Alimento` | `nombre`, `medidaCanonica`, `factorCoccion?`, `espacioId?` (nulo = global) | 1 |
| `MedidaCasera` | `alimentoId`, `nombre` ("taza", "filete mediano"), `cantidadCanonica`, `estado` | 1 |
| `Equivalencia` | `tablaId`, `alimentoId`, `grupoId`, `cantidadPorUnidad`, `factorCoccion?` | 1 |

Reglas:

- El **grupo de un alimento depende de la tabla**: la relación alimento–grupo vive en `Equivalencia`, no en `Alimento`.
- `Equivalencia` es única por (`tablaId`, `alimentoId`).
- Herencia: la tabla efectiva es la cadena `base → hija`, donde la hija sobrescribe las equivalencias de los mismos alimentos y puede usar grupos de su cadena. La resolución la hace `packages/equivalencias`, no la base de datos.
- `cantidadPorUnidad` está en unidad canónica y en crudo.
- `factorCoccion` = peso cocido / peso crudo. El de `Equivalencia` sobrescribe al de `Alimento`. Si no hay ninguno, el alimento no admite conversión a cocido.

## 3. Planes

| Entidad | Campos clave | Fase |
| --- | --- | --- |
| `Plan` | `espacioId`, `pacienteId` (usuario), `tablaId`, `autorId`, `nombre`, `estado`, `origenPlanId?`, `origenDescripcion?` | 1 |
| `VersionPlan` | `planId`, `numero`, `vigenteDesde`, `notas?`, `creadaPorId` | 1 |
| `Comida` | `versionId`, `nombre`, `orden`, `horaSugerida?`, `notas?` | 1 |
| `PorcionPlan` | `comidaId`, `grupoId`, `unidades` | 1 |
| `PlantillaPlan` | igual que `Plan` sin paciente; se instancia en planes | 3 |

Reglas:

- Una versión nunca se edita después de publicada. Ajustar el plan = crear la versión `numero + 1`, copiando y modificando.
- La versión vigente en una fecha es la de mayor `vigenteDesde` menor o igual a esa fecha.
- Un paciente tiene como máximo un plan `ACTIVO` por espacio.
- Copia al terminar una membresía de paciente (fase 3): se crea un `Plan` nuevo en el espacio personal con la versión vigente y sus notas, `origenPlanId` apuntando al original y `origenDescripcion` con nutricionista, organización y fecha.

## 4. Registros y progreso

| Entidad | Campos clave | Fase |
| --- | --- | --- |
| `RegistroComida` | `usuarioId`, `fecha` (date), `comidaId`, `eliminadoEn?` | 1 |
| `ItemRegistro` | `registroId`, `alimentoId`, `cantidadCanonica` (crudo), `estadoIngresado`, `grupoId`, `unidades` | 1 |
| `Medicion` | `usuarioId`, `tipo` (peso, cintura…), `valor`, `unidad`, `fecha`, `eliminadoEn?` | 2 |

Reglas:

- `ItemRegistro` guarda el **resultado del cálculo** (`grupoId`, `unidades`). Cambiar una equivalencia después no altera registros pasados.
- `estadoIngresado` recuerda si el usuario lo ingresó crudo o cocido, solo para mostrarlo igual.
- La adherencia no se guarda; se calcula.

## 5. Vínculos y consentimiento (fase 3)

| Entidad | Campos clave |
| --- | --- |
| `Invitacion` | `espacioId`, `rol`, `codigo` (único), `expiraEn`, `usadaPorId?`, `usadaEn?` |
| `Consentimiento` | `membresiaId`, `compartePeso`, `comparteRegistros`, `comparteMediciones`, `actualizadoEn` |

## 6. Auditoría (fase 3)

| Entidad | Campos clave |
| --- | --- |
| `AccesoAuditado` | `actorId`, `usuarioObjetivoId`, `espacioId`, `recurso`, `accion`, `fecha` |

Solo inserción: sin actualizaciones ni borrados, también a nivel de permisos de base de datos.

## Fase 4 (pendiente de diseño detallado)

`Despensa`, `ItemDespensa`, `Compra`, `Receta`. Se diseñan al iniciar la fase 4, respetando que toda cantidad pase por `packages/equivalencias`.
