import api from "./api";
import type { ApiSuccess, Budget, BudgetPayload } from "../types/api";

export async function fetchBudgets(): Promise<Budget[]> {
  const response = await api.get<ApiSuccess<Budget[]>>("/budgets");
  return response.data.data;
}

export async function createBudget(payload: BudgetPayload): Promise<Budget> {
  const response = await api.post<ApiSuccess<Budget>>("/budgets", payload);
  return response.data.data;
}

export async function updateBudget(
  id: string,
  payload: BudgetPayload
): Promise<Budget> {
  const response = await api.put<ApiSuccess<Budget>>(`/budgets/${id}`, payload);
  return response.data.data;
}

export async function deleteBudget(id: string): Promise<void> {
  await api.delete(`/budgets/${id}`);
}
