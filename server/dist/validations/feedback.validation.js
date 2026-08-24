import { z } from "zod";
export const feedbackTypeSchema = z.enum([
    "GENERAL",
    "BUG",
    "FEATURE",
    "UI_UX",
    "PERFORMANCE",
]);
export const createFeedbackSchema = z.object({
    rating: z
        .number()
        .int("Rating must be between 1 and 5")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),
    type: feedbackTypeSchema,
    message: z
        .string()
        .trim()
        .min(1, "Message is required")
        .max(1000, "Message is too long"),
    featureRequest: z
        .string()
        .trim()
        .max(1000, "Feature request is too long")
        .optional()
        .nullable(),
    page: z.string().trim().max(200, "Page is too long").optional().nullable(),
    browser: z
        .string()
        .trim()
        .max(300, "Browser info is too long")
        .optional()
        .nullable(),
});
//# sourceMappingURL=feedback.validation.js.map