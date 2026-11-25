/**
 * Contratos compartidos de Vianda: enums del dominio, esquemas Zod y los tipos
 * inferidos de ellos. Sin lógica de negocio ni tipos de Prisma.
 */
import { z } from 'zod';

export const esquemaSalud = z.object({
  estado: z.literal('ok'),
});

export type Salud = z.infer<typeof esquemaSalud>;
