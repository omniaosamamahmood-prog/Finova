export const queryKeys = {
  transactions: ["transactions"] as const,
  transaction: (id: string) => ["transactions", id] as const,
  categories: ["categories"] as const,
  dashboard: ["dashboard"] as const,
};
