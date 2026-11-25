# Arquitectura

## Visión general

Monorepo TypeScript con pnpm workspaces y Turborepo. Una API central, dos clientes y dos paquetes compartidos.

```
vianda/
├── apps/
│   ├── api/                 Nest.js, Prisma, PostgreSQL
│   │   ├── prisma/          schema.prisma, migraciones, seed
│   │   └── src/modules/
│   │       ├── auth/
│   │       ├── espacios/    espacios y membresías
│   │       ├── catalogo/    tablas, grupos, alimentos, equivalencias, medidas caseras
│   │       ├── planes/      planes, versiones, comidas, porciones
│   │       ├── registros/   registros de comida e ítems
│   │       └── ia/          fase 4
│   ├── web/                 React + Vite
│   └── mobile/              Expo + Expo Router
├── packages/
│   ├── shared/              esquemas Zod, tipos, contratos de la API
│   └── equivalencias/       motor de cálculo puro
└── docs/
```

## Responsabilidades

### `packages/equivalencias`

El corazón de Vianda. TypeScript puro, sin dependencias de runtime salvo, si hace falta, una librería de decimales.

- Resolver una tabla efectiva a partir de su cadena de herencia (la tabla hija sobrescribe a la base).
- Convertir una cantidad de un alimento (en medida casera o canónica, crudo o cocido) a unidades de su grupo.
- Convertir unidades de un grupo a la cantidad de un alimento concreto, en crudo y en cocido, y en sus medidas caseras.
- Calcular las unidades pendientes de una comida a partir de sus porciones y de los ítems registrados, distinguiendo unidades detalladas y sin detallar (marca rápida).
- Derivar el **estado de cada comida** en una fecha (pendiente, incompleta, cumplida, comida libre, fuera del plan, omitida, sin registrar) a partir de la versión vigente y de los registros. Los estados no se guardan.
- **Clasificar "comí otra cosa"** como `LIBRE` o `FUERA_DEL_PLAN` según las comidas libres permitidas por semana y las ya usadas. La API guarda el resultado al registrar; si se elimina o cambia una comida libre, el motor recalcula la clasificación de las demás de esa semana.
- Calcular los **indicadores** de un período: cumplimiento desglosado (cumplidas, fuera del plan, omitidas, sin registrar), detalle, constancia y fuera del plan. En la fase 1 se usan los del día; los semanales llegan en la fase 2.

Las definiciones exactas de estados e indicadores están en `docs/modelo-de-datos.md`, sección 5. Como el motor es puro, recibe como datos todo lo que depende del contexto: la fecha, si el día ya terminó y la semana a considerar. Nunca lee el reloj ni la zona horaria.

Firma orientativa:

```ts
resolverTabla(cadena: TablaConDatos[]): TablaEfectiva
aUnidades(tabla: TablaEfectiva, entrada: CantidadDeAlimento): { grupoId: string; unidades: Decimal }
desdeUnidades(tabla: TablaEfectiva, consulta: { alimentoId: string; unidades: Decimal }): Porcion
pendientes(comida: ComidaConPorciones, items: ItemCalculado[]): PendientePorGrupo[]
estadoComida(comida: ComidaConPorciones, registro: RegistroConItems | null, diaTerminado: boolean): EstadoComida
clasificarOtraCosa(permitidasPorSemana: number, libresYaUsadas: number): ClasificacionReemplazo
reclasificarSemana(permitidasPorSemana: number, reemplazos: ReemplazoDeLaSemana[]): ReemplazoClasificado[]
indicadores(comidas: ComidaDelPeriodo[]): Indicadores
```

Reglas: funciones puras y deterministas; los errores de dominio se devuelven como resultados tipados, no como excepciones genéricas; cobertura de pruebas alta, con casos de redondeo, crudo/cocido y herencia de tablas.

### `packages/shared`

- Esquemas Zod de entrada y salida de cada endpoint, y los tipos inferidos de ellos.
- Enums del dominio compartidos con los clientes.
- No contiene lógica de negocio ni tipos generados por Prisma: los clientes nunca dependen de Prisma.

### `apps/api`

- REST sobre Nest.js. Cada endpoint valida con los esquemas de `shared`.
- Prisma como ORM; PostgreSQL como base.
- Usa `equivalencias` para calcular al guardar registros y para validar planes.
- Única puerta a servicios externos, incluida la IA en la fase 4. Ninguna llave de terceros llega a los clientes.

### `apps/web`

- React + Vite, SPA detrás de inicio de sesión.
- Fase 1: "Mi plan" como inicio, primera vez, configuración del catálogo (grupos, alimentos, equivalencias, medidas caseras, factores de cocción) y constructor del plan.
- Fase 3: se convierte en el portal profesional (nutricionista y organización).

### `apps/mobile`

- Expo con Expo Router.
- Fase 1: "Hoy" con sus estados, registro completo (un toque, marca rápida, comí otra cosa, no la comí, extras, deshacer), calculadora de porciones y resumen del día.
- Calcula localmente con `equivalencias` usando el plan y la tabla efectiva descargados, para responder al instante. La sincronización sin conexión completa queda para más adelante.

## Autenticación y permisos

- **Autenticación propia** en la API: correo y contraseña (hash con argon2 o bcrypt), token de acceso de vida corta y token de refresco rotativo. Inicio de sesión con Google en una fase posterior.
- **Sesión persistente y deslizante de 90 días** (ver decisión 0014). La sesión no se cierra salvo que el usuario lo decida:
  - Cada `SesionRefresco` guarda solo el hash del token, el dispositivo, `ultimoUsoEn`, `expiraEn` y `revocadoEn`.
  - **Cada refresco rota el token:** invalida el anterior, emite uno nuevo, actualiza `ultimoUsoEn` y extiende `expiraEn` a 90 días desde ese momento. Así, la sesión solo vence tras 90 días sin uso.
  - **Revocación:** al cerrar sesión se revoca la sesión de ese dispositivo. Al cambiar la contraseña o con "cerrar sesión en todos los dispositivos" se revocan todas las sesiones del usuario.
  - **Almacenamiento:** en el móvil, los tokens van en `expo-secure-store`, cifrados por el sistema operativo. El almacenamiento en la web se define en el paso 5.
  - Bloqueo con biometría: opcional y desactivado por defecto, fuera de la fase 1. Las sesiones de profesionales serán más cortas (fase 3).
- **Autorización por membresía.** Las rutas de datos de un espacio llevan el `espacioId`. Un guard de Nest verifica que el usuario tenga una membresía activa en ese espacio y que su rol permita la acción.
- Matriz inicial de permisos:

| Acción | Dueño (personal) | Nutricionista | Admin organización | Paciente |
| --- | --- | --- | --- | --- |
| Editar catálogo del espacio | Sí | Sí | Sí | No |
| Crear y versionar planes | Sí | Sí | No | No |
| Ver su plan | Sí | — | — | Sí |
| Registrar comidas propias | Sí | — | — | Sí |
| Ver registros de un paciente | — | Según consentimiento | No | — |
| Gestionar membresías | — | No | Sí | No |

- **Seguridad por fila** de PostgreSQL como segunda capa, antes de abrir la app a organizaciones (fase 3). En fase 1 el aislamiento se garantiza en la API.

## Flujo de un registro de comida

1. El cliente envía alimento, cantidad, medida y estado (crudo o cocido).
2. La API carga la tabla efectiva del plan y llama a `aUnidades`.
3. Se guarda el ítem con su cantidad canónica en crudo, su grupo y sus unidades calculadas.
4. "Hoy" se recalcula con `pendientes` y `estadoComida` sobre la versión vigente del plan.

Variantes, todas sin paso de confirmación y corregibles con "Deshacer", "Cambiar" o "Quitar" (ver decisión 0015):

- **Marca rápida** ("Ya la comí, sin detallar"): se guarda un ítem con grupo y unidades, sin alimento. Detallarlo completa ese mismo ítem (ver decisión 0016).
- **"Comí otra cosa":** la API cuenta las comidas libres ya usadas en la semana, llama a `clasificarOtraCosa` y guarda la clasificación en el `RegistroComida` (ver decisión 0017).
- **"No la comí":** `RegistroComida` con resultado `OMITIDA`, sin ítems.
- **Extra:** ítem con `esExtra`, calculado con `aUnidades`, que no suma al cumplimiento.

## Pruebas

- `packages/equivalencias` y `packages/shared`: Vitest.
- `apps/api`: Vitest (estándar de Nest 12, ver decisión 0012), con pruebas de integración contra una base PostgreSQL de prueba.
- `apps/web` (Vitest y Testing Library) y `apps/mobile` (Jest con `jest-expo`): pruebas de componentes donde haya lógica; la lógica de cálculo ya está probada en el paquete.

## Configuración y secretos

- Variables de entorno por app con un `.env.example` versionado; los `.env` reales nunca se suben.
- PostgreSQL local con Docker Compose en la raíz. Sus credenciales, puerto y nombres de bases viven solo en el `.env` de la raíz; la API construye la URL de conexión con esos valores (ver decisión 0013).
