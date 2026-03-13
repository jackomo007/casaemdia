import { z } from "zod";

export const authSchema = z.object({
  fullName: z.string().min(3, "Informe seu nome completo."),
  email: z.email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres."),
  scenario: z
    .enum(["trialing", "active", "expired", "past_due"])
    .default("trialing"),
});

export const loginSchema = authSchema.pick({
  email: true,
  password: true,
  scenario: true,
});

export const registerSchema = authSchema;

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
