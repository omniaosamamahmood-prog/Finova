import { z } from "zod";

export const goalSchema = z.object({
  name: z.string().trim().min(2, "goals.validation.name"),
  targetAmount: z.number().positive("goals.validation.targetAmount"),
  currentAmount: z.number().min(0, "goals.validation.currentAmount"),
  targetDate: z.string().optional(),
});

export type GoalFormData = z.infer<typeof goalSchema>;
