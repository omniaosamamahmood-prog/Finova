export type TransactionType = "INCOME" | "EXPENSE";

export type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryPayload = {
  name: string;
  type: TransactionType;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  transactionDate: string;
  categoryId: string;
  category?: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
};

export type TransactionPayload = {
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  transactionDate: string;
};

export type Budget = {
  id: string;
  amount: number;
  categoryId: string;
  category?: Category;
  userId: string;
  spent: number;
  remaining: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export type BudgetPayload = {
  amount: number;
  categoryId: string;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  userId: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export type GoalPayload = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
};

export type ReportCategoryAmount = {
  category: string;
  amount: number;
  percentage: number;
};

export type ReportSummary = {
  month: number;
  year: number;
  totalExpense: number;
  expensesByCategory: ReportCategoryAmount[];
};

export type MonthlyTrendPoint = {
  month: number;
  income: number;
  expense: number;
};

export type TopSpendingCategory = {
  category: string;
  amount: number;
};

export type RecurringTransaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: string;
  nextRunAt: string;
  isActive: boolean;
  categoryId: string;
  category?: Pick<Category, "id" | "name" | "type">;
  createdAt: string;
  updatedAt: string;
};

export type RecurringTransactionPayload = {
  title: string;
  amount: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  categoryId: string;
  startDate: string;
  isActive?: boolean;
};

export type InsightType = "success" | "warning" | "danger" | "info";

export type FinancialInsight = {
  type: InsightType;
  title: string;
  message: string;
  icon: string;
  params?: Record<string, string | number>;
};

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  isAdmin?: boolean;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UpdateProfilePayload = {
  fullName?: string;
  avatar?: File;
  removeAvatar?: boolean;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorBody = {
  success: false;
  message?: string;
  errors?: string[];
};
