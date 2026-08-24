import api from "./api";
import type {
  ApiSuccess,
  MonthlyTrendPoint,
  ReportSummary,
  TopSpendingCategory,
} from "../types/api";

export async function fetchReportSummary(
  month: number,
  year: number
): Promise<ReportSummary> {
  const response = await api.get<ApiSuccess<ReportSummary>>("/reports/summary", {
    params: { month, year },
  });
  return response.data.data;
}

export async function fetchMonthlyTrend(
  year: number
): Promise<MonthlyTrendPoint[]> {
  const response = await api.get<ApiSuccess<MonthlyTrendPoint[]>>(
    "/reports/monthly-trend",
    { params: { year } }
  );
  return response.data.data;
}

export async function fetchTopCategories(
  month: number,
  year: number
): Promise<TopSpendingCategory[]> {
  const response = await api.get<ApiSuccess<TopSpendingCategory[]>>(
    "/reports/top-categories",
    { params: { month, year } }
  );
  return response.data.data;
}
