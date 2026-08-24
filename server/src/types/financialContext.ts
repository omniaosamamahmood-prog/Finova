export type FinancialContextSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
};

export type FinancialContextCategory = {
  name: string;
  amount: number;
  percentage: number;
};

export type FinancialContextBudget = {
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  progress: number;
  exceeded: boolean;
};

export type FinancialContextGoal = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  remaining: number;
  progress: number;
  targetDate: string | null;
};

export type FinancialContextRecurring = {
  activeRecurringCount: number;
  upcomingExpenseTotalThisMonth: number;
};

export type FinancialContext = {
  month: number;
  year: number;
  summary: FinancialContextSummary;
  topCategories: FinancialContextCategory[];
  budgets: FinancialContextBudget[];
  goals: FinancialContextGoal[];
  recurring: FinancialContextRecurring;
};
