import { z } from "zod";

export const recurringTransactionSchema = z.object({
  title: z.string().trim().min(2, "recurring.validation.title"),
  amount: z.number().positive("recurring.validation.amount"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "recurring.validation.category"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  startDate: z.string().min(1, "recurring.validation.startDate"),
  isActive: z.boolean(),
});

export type RecurringTransactionFormData = z.infer<
  typeof recurringTransactionSchema
>;
