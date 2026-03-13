import { z } from "zod";

const fullNameSchema = z
  .string()
  .trim()
  .min(3, "Informe seu nome completo.")
  .max(80, "Use no máximo 80 caracteres.");

const emailSchema = z
  .string()
  .trim()
  .email("Informe um e-mail válido.")
  .max(120, "Use no máximo 120 caracteres.");

export const loginPasswordSchema = z
  .string()
  .min(6, "A senha precisa ter ao menos 6 caracteres.")
  .max(72, "A senha pode ter no máximo 72 caracteres.");

export const registerPasswordSchema = z
  .string()
  .min(8, "A senha precisa ter ao menos 8 caracteres.")
  .max(72, "A senha pode ter no máximo 72 caracteres.")
  .regex(/[A-Za-z]/, "A senha precisa ter ao menos uma letra.")
  .regex(/\d/, "A senha precisa ter ao menos um número.");

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const registerSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: registerPasswordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
