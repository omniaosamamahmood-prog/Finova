export const queryKeys = {
  transactions: ["transactions"] as const,
  transaction: (id: string) => ["transactions", id] as const,
  categories: ["categories"] as const,
  category: (id: string) => ["categories", id] as const,
  dashboard: ["dashboard"] as const,
  budgets: ["budgets"] as const,
  budget: (id: string) => ["budgets", id] as const,
  goals: ["goals"] as const,
  goal: (id: string) => ["goals", id] as const,
  reports: ["reports"] as const,
  reportSummary: (month: number, year: number) =>
    ["reports", "summary", month, year] as const,
  reportMonthlyTrend: (year: number) =>
    ["reports", "monthly-trend", year] as const,
  reportTopCategories: (month: number, year: number) =>
    ["reports", "top-categories", month, year] as const,
  insights: ["insights"] as const,
  recurringTransactions: ["recurring-transactions"] as const,
  recurringTransaction: (id: string) =>
    ["recurring-transactions", id] as const,
  profile: ["profile"] as const,
  myFeedback: ["feedback", "me"] as const,
  adminOverview: ["admin", "overview"] as const,
  adminUsers: ["admin", "users"] as const,
  adminFeedback: ["admin", "feedback"] as const,
};
