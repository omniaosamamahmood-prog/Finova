import { z } from "zod";
const frequencyEnum = z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);
const typeEnum = z.enum(["INCOME", "EXPENSE"]);
export const createRecurringTransactionSchema = z.object({
    title: z.string().trim().min(2, "Title must be at least 2 characters"),
    amount: z.number().positive("Amount must be greater than zero"),
    type: typeEnum,
    frequency: frequencyEnum,
    categoryId: z.string().min(1, "Category is required"),
    startDate: z.string().min(1, "Start date is required"),
    isActive: z.boolean().optional(),
});
export const updateRecurringTransactionSchema = createRecurringTransactionSchema.partial();
export const toggleRecurringTransactionSchema = z.object({
    isActive: z.boolean(),
});
//# sourceMappingURL=recurringTransaction.validation.js.map