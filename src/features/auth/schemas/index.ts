import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const registerSchema = z
  .object({
    nombre: z.string().min(2, "Mínimo 2 caracteres").max(60),
    apellido: z.string().min(2, "Mínimo 2 caracteres").max(60),
    email: z.string().email("Correo inválido"),
    telefono: z
      .string()
      .trim()
      .regex(/^\+?\d{10,15}$/u, "Teléfono inválido")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/u, "Incluye una mayúscula")
      .regex(/[a-z]/u, "Incluye una minúscula")
      .regex(/\d/u, "Incluye un número"),
    password_confirm: z.string(),
    suscribir_newsletter: z.boolean().optional().default(false),
  })
  .refine((d) => d.password === d.password_confirm, {
    path: ["password_confirm"],
    message: "Las contraseñas no coinciden",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
