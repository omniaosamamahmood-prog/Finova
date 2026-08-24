import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "categories.validation.name"),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
