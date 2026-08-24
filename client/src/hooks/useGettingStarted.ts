import { useBudgets } from "./useBudgets";
import { useDashboardStats } from "./useDashboard";
import { useGoals } from "./useGoals";

export function useGettingStarted() {
  const statsQuery = useDashboardStats();
  const budgetsQuery = useBudgets();
  const goalsQuery = useGoals();

  const stats = statsQuery.data ?? {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0,
  };

  const hasTransactions = stats.transactionCount > 0;
  const hasBudgets = (budgetsQuery.data?.length ?? 0) > 0;
  const hasGoals = (goalsQuery.data?.length ?? 0) > 0;

  return {
    stats,
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
    hasTransactions,
    hasBudgets,
    hasGoals,
    showOnboarding: statsQuery.isSuccess && !hasTransactions,
  };
}
