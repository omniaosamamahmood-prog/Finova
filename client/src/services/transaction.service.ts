import api from "./api";
import type {
  ApiSuccess,
  Transaction,
  TransactionPayload,
} from "../types/api";

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await api.get<ApiSuccess<Transaction[]>>("/transactions");
  return response.data.data;
}

export async function fetchTransactionById(id: string): Promise<Transaction> {
  const response = await api.get<ApiSuccess<Transaction>>(
    `/transactions/${id}`
  );
  return response.data.data;
}

export async function createTransaction(
  payload: TransactionPayload
): Promise<Transaction> {
  const response = await api.post<ApiSuccess<Transaction>>(
    "/transactions",
    payload
  );
  return response.data.data;
}

export async function updateTransaction(
  id: string,
  payload: TransactionPayload
): Promise<Transaction> {
  const response = await api.put<ApiSuccess<Transaction>>(
    `/transactions/${id}`,
    payload
  );
  return response.data.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
