import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("validation.email.invalid"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "validation.password.min"),
    confirmPassword: z.string().min(1, "auth.reset.validation.confirm"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.reset.validation.mismatch",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const resendVerificationSchema = z.object({
  email: z.string().email("validation.email.invalid"),
});

export type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;
