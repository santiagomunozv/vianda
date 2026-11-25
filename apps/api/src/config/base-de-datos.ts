import { z } from 'zod';

const esquemaPostgres = z.object({
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_DB_TEST: z.string().min(1),
});

/**
 * Construye la URL de conexión con las mismas variables POSTGRES_* que usa
 * docker-compose.yml, para que nunca queden desalineadas.
 */
export function urlBaseDeDatos(
  entorno: Record<string, string | undefined>,
  opciones: { prueba?: boolean } = {},
): string {
  const resultado = esquemaPostgres.safeParse(entorno);
  if (!resultado.success) {
    // Solo nombres de variables: nunca se incluyen sus valores.
    const faltantes = resultado.error.issues.map((problema) => problema.path.join('.'));
    throw new Error(
      `Configuración de PostgreSQL inválida en: ${faltantes.join(', ')}. Revisa el .env de la raíz.`,
    );
  }

  const v = resultado.data;
  const base = opciones.prueba ? v.POSTGRES_DB_TEST : v.POSTGRES_DB;
  const usuario = encodeURIComponent(v.POSTGRES_USER);
  const clave = encodeURIComponent(v.POSTGRES_PASSWORD);
  return `postgresql://${usuario}:${clave}@${v.POSTGRES_HOST}:${v.POSTGRES_PORT}/${encodeURIComponent(base)}?schema=public`;
}
