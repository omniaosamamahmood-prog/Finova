import { z } from "zod";
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "validation.fullName.min"),

  email: z
    .string()
    .email("validation.email.invalid"),

  password: z
    .string()
    .min(6, "validation.password.min"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export const loginSchema = z.object({
  email: z
    .string()
    .email("validation.email.invalid"),

  password: z
    .string()
    .min(6, "validation.password.min"),
});

export type LoginFormData = z.infer<typeof loginSchema>;