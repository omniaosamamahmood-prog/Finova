export type TransactionType = "INCOME" | "EXPENSE";

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
