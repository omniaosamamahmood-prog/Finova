import { z } from "zod";

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "budgets.validation.category"),
  amount: z.number().positive("budgets.validation.amount"),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;
