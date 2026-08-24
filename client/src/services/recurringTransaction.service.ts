import api from "./api";
import type {
  ApiSuccess,
  RecurringTransaction,
  RecurringTransactionPayload,
} from "../types/api";

export async function fetchRecurringTransactions(): Promise<
  RecurringTransaction[]
> {
  const response = await api.get<ApiSuccess<RecurringTransaction[]>>(
    "/recurring-transactions"
  );
  return response.data.data;
}

export async function fetchRecurringTransactionById(
  id: string
): Promise<RecurringTransaction> {
  const response = await api.get<ApiSuccess<RecurringTransaction>>(
    `/recurring-transactions/${id}`
  );
  return response.data.data;
}

export async function createRecurringTransaction(
  payload: RecurringTransactionPayload
): Promise<RecurringTransaction> {
  const response = await api.post<ApiSuccess<RecurringTransaction>>(
    "/recurring-transactions",
    payload
  );
  return response.data.data;
}

export async function updateRecurringTransaction(
  id: string,
  payload: RecurringTransactionPayload
): Promise<RecurringTransaction> {
  const response = await api.put<ApiSuccess<RecurringTransaction>>(
    `/recurring-transactions/${id}`,
    payload
  );
  return response.data.data;
}

export async function toggleRecurringTransaction(
  id: string,
  isActive: boolean
): Promise<RecurringTransaction> {
  const response = await api.patch<ApiSuccess<RecurringTransaction>>(
    `/recurring-transactions/${id}/status`,
    { isActive }
  );
  return response.data.data;
}

export async function deleteRecurringTransaction(id: string): Promise<void> {
  await api.delete(`/recurring-transactions/${id}`);
}
