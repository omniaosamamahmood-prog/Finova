import api from "./api";
import type { ApiSuccess, DashboardStats } from "../types/api";

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<ApiSuccess<DashboardStats>>("/dashboard");
  return response.data.data;
}
