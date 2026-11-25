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
- Calcular las unidades pendientes de una comida a partir de sus porciones y de los ítems registrados.
- Calcular adherencia de un período (fase 2).

Firma orientativa:

```ts
resolverTabla(cadena: TablaConDatos[]): TablaEfectiva
aUnidades(tabla: TablaEfectiva, entrada: CantidadDeAlimento): { grupoId: string; unidades: Decimal }
desdeUnidades(tabla: TablaEfectiva, consulta: { alimentoId: string; unidades: Decimal }): Porcion
pendientes(comida: ComidaConPorciones, items: ItemCalculado[]): PendientePorGrupo[]
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
- Fase 1: configuración del catálogo (grupos, alimentos, equivalencias, medidas caseras, factores de cocción) y constructor del plan.
- Fase 3: se convierte en el portal profesional (nutricionista y organización).

### `apps/mobile`

- Expo con Expo Router.
- Fase 1: "Qué me toca", calculadora de porciones y marcar lo comido.
- Calcula localmente con `equivalencias` usando el plan y la tabla efectiva descargados, para responder al instante. La sincronización sin conexión completa queda para más adelante.

## Autenticación y permisos

- **Autenticación propia** en la API: correo y contraseña (hash con argon2 o bcrypt), token de acceso de vida corta y token de refresco rotativo. Inicio de sesión con Google en una fase posterior.
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
4. "Qué me toca" se recalcula con `pendientes` sobre la versión vigente del plan.

## Pruebas

- `packages/equivalencias` y `packages/shared`: Vitest.
- `apps/api`: Jest (estándar de Nest), con pruebas de integración contra una base PostgreSQL de prueba.
- `apps/web` y `apps/mobile`: pruebas de componentes donde haya lógica; la lógica de cálculo ya está probada en el paquete.

## Configuración y secretos

- Variables de entorno por app con un `.env.example` versionado; los `.env` reales nunca se suben.
- PostgreSQL local con Docker Compose en la raíz.
