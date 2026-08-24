import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  fetchRecurringTransactionById,
  fetchRecurringTransactions,
  toggleRecurringTransaction,
  updateRecurringTransaction,
} from "../services/recurringTransaction.service";
import type {
  RecurringTransaction,
  RecurringTransactionPayload,
} from "../types/api";

function invalidateRecurringQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.recurringTransactions }),
    queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
  ]);
}

export function useRecurringTransactions() {
  return useQuery({
    queryKey: queryKeys.recurringTransactions,
    queryFn: fetchRecurringTransactions,
  });
}

export function useRecurringTransaction(id: string | undefined) {
  return useQuery({
    queryKey: id
      ? queryKeys.recurringTransaction(id)
      : queryKeys.recurringTransactions,
    queryFn: () => fetchRecurringTransactionById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RecurringTransactionPayload) =>
      createRecurringTransaction(payload),
    onSuccess: async () => {
      await invalidateRecurringQueries(queryClient);
    },
  });
}

export function useUpdateRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RecurringTransactionPayload;
    }) => updateRecurringTransaction(id, payload),
    onSuccess: async () => {
      await invalidateRecurringQueries(queryClient);
    },
  });
}

export function useToggleRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleRecurringTransaction(id, isActive),
    onSuccess: async () => {
      await invalidateRecurringQueries(queryClient);
    },
  });
}

export function useDeleteRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecurringTransaction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.recurringTransactions,
      });
      const previous = queryClient.getQueryData<RecurringTransaction[]>(
        queryKeys.recurringTransactions
      );
      queryClient.setQueryData<RecurringTransaction[]>(
        queryKeys.recurringTransactions,
        (current = []) => current.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.recurringTransactions,
          context.previous
        );
      }
    },
    onSettled: async () => {
      await invalidateRecurringQueries(queryClient);
    },
  });
}
