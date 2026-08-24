import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { fetchFinancialInsights } from "../services/insight.service";

export function useFinancialInsights() {
  return useQuery({
    queryKey: queryKeys.insights,
    queryFn: fetchFinancialInsights,
  });
}
