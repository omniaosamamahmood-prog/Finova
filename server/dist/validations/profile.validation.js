import { z } from "zod";
export const updateProfileSchema = z.object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
});
export const changePasswordSchema = z
    .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
//# sourceMappingURL=profile.validation.js.map