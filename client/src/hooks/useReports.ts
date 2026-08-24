import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import {
  fetchMonthlyTrend,
  fetchReportSummary,
  fetchTopCategories,
} from "../services/report.service";

export function useReportSummary(month: number, year: number) {
  return useQuery({
    queryKey: queryKeys.reportSummary(month, year),
    queryFn: () => fetchReportSummary(month, year),
    enabled: month >= 1 && month <= 12 && year > 0,
  });
}

export function useMonthlyTrend(year: number) {
  return useQuery({
    queryKey: queryKeys.reportMonthlyTrend(year),
    queryFn: () => fetchMonthlyTrend(year),
    enabled: year > 0,
  });
}

export function useTopCategories(month: number, year: number) {
  return useQuery({
    queryKey: queryKeys.reportTopCategories(month, year),
    queryFn: () => fetchTopCategories(month, year),
    enabled: month >= 1 && month <= 12 && year > 0,
  });
}
