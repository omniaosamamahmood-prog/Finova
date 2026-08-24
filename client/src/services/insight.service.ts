import api from "./api";
import type { ApiSuccess, FinancialInsight } from "../types/api";

export async function fetchFinancialInsights(): Promise<FinancialInsight[]> {
  const response = await api.get<ApiSuccess<FinancialInsight[]>>("/insights");
  return response.data.data;
}
