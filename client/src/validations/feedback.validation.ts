import { z } from "zod";
import { FEEDBACK_TYPES } from "../types/feedback";

export const feedbackSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "feedback.validation.rating")
    .max(5, "feedback.validation.rating"),
  type: z.enum(FEEDBACK_TYPES),
  message: z
    .string()
    .trim()
    .min(1, "feedback.validation.message")
    .max(1000, "feedback.validation.messageMax"),
  featureRequest: z
    .string()
    .max(1000, "feedback.validation.featureMax")
    .optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
