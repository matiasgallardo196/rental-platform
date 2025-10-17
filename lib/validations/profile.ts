import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor ingresa un correo válido"),
  bio: z
    .string()
    .max(500, "La biografía debe tener menos de 500 caracteres")
    .optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
