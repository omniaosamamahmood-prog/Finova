import { z } from "zod";

export const aiChatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message is too long"),
  language: z.enum(["en", "ar"]).optional().default("en"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .max(10)
    .optional()
    .default([]),
});

export type AiChatInput = z.infer<typeof aiChatSchema>;
