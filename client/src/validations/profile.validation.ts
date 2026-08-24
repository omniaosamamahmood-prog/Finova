import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(3, "validation.fullName.min"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "settings.validation.currentPassword"),
    newPassword: z.string().min(6, "validation.password.min"),
    confirmPassword: z.string().min(1, "settings.validation.confirmPassword"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "settings.validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const ACCEPTED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
