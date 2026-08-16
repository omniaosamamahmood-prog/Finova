import { z } from "zod";

export const transactionSchema = z.object({
  title: z.string().min(2, "transactions.validation.title"),
  amount: z.number().positive("transactions.validation.amount"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "transactions.validation.category"),
  transactionDate: z.string().min(1, "transactions.validation.date"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
