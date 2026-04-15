import { z } from "zod";

export const suscribirSchema = z.object({
  email: z.string().email("Correo inválido"),
  nombre: z
    .string()
    .trim()
    .max(60)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type SuscribirInput = z.infer<typeof suscribirSchema>;
