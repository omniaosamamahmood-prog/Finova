import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategoryById,
  updateCategory,
} from "../services/category.service";
import type { Category, CategoryPayload } from "../types/api";

async function invalidateCategoryDependents(
  queryClient: ReturnType<typeof useQueryClient>
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions }),
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
    queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
  ]);
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.category(id) : queryKeys.categories,
    queryFn: () => fetchCategoryById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: async () => {
      await invalidateCategoryDependents(queryClient);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) =>
      updateCategory(id, payload),
    onSuccess: async () => {
      await invalidateCategoryDependents(queryClient);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.categories });
      const previous = queryClient.getQueryData<Category[]>(
        queryKeys.categories
      );
      queryClient.setQueryData<Category[]>(queryKeys.categories, (current = []) =>
        current.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.categories, context.previous);
      }
    },
    onSettled: async () => {
      await invalidateCategoryDependents(queryClient);
    },
  });
}
