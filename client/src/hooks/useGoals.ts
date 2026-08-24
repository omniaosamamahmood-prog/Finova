import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import {
  createGoal,
  deleteGoal,
  fetchGoalById,
  fetchGoals,
  updateGoal,
} from "../services/goal.service";
import type { Goal, GoalPayload } from "../types/api";

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: fetchGoals,
  });
}

export function useGoal(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.goal(id) : queryKeys.goals,
    queryFn: () => fetchGoalById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GoalPayload) => createGoal(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.goals }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
      ]);
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: GoalPayload }) =>
      updateGoal(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.goals }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
      ]);
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.goals });
      const previous = queryClient.getQueryData<Goal[]>(queryKeys.goals);
      queryClient.setQueryData<Goal[]>(queryKeys.goals, (current = []) =>
        current.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.goals, context.previous);
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.goals }),
        queryClient.invalidateQueries({ queryKey: queryKeys.insights }),
      ]);
    },
  });
}
