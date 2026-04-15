import { z } from "zod";

export const direccionSchema = z.object({
  calle: z.string().trim().min(5, "Mínimo 5 caracteres").max(200),
  ciudad: z.string().trim().min(2).max(80),
  cp: z
    .string()
    .trim()
    .regex(/^\d{4,6}$/u, "CP inválido"),
  estado: z.string().trim().min(2).max(80),
  pais: z.string().trim().min(2).max(60).default("México"),
  es_principal: z.boolean().optional().default(false),
});

export type DireccionInput = z.infer<typeof direccionSchema>;
