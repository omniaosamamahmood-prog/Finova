import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import {
  createBudget,
  deleteBudget,
  fetchBudgets,
  updateBudget,
} from "../services/budget.service";
import type { Budget, BudgetPayload } from "../types/api";

export function useBudgets() {
  return useQuery({
    queryKey: queryKeys.budgets,
    queryFn: fetchBudgets,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BudgetPayload) => createBudget(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.budgets }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
      ]);
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BudgetPayload }) =>
      updateBudget(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.budgets }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
      ]);
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.budgets });
      const previous = queryClient.getQueryData<Budget[]>(queryKeys.budgets);
      queryClient.setQueryData<Budget[]>(queryKeys.budgets, (current = []) =>
        current.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.budgets, context.previous);
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.budgets }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
      ]);
    },
  });
}
