import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { useProfile } from "./useProfile";
import {
  fetchAdminFeedback,
  fetchAdminOverview,
  fetchAdminUsers,
  updateAdminUserPlan,
} from "../services/admin.service";
import type { UserPlan } from "../types/api";

export function useIsAdmin() {
  const { data: profile, isSuccess } = useProfile();
  return isSuccess && profile?.isAdmin === true;
}

export function useAdminOverview(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.adminOverview,
    queryFn: fetchAdminOverview,
    enabled,
    retry: false,
  });
}

export function useAdminUsers(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: fetchAdminUsers,
    enabled,
    retry: false,
  });
}

export function useAdminFeedback(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.adminFeedback,
    queryFn: fetchAdminFeedback,
    enabled,
    retry: false,
  });
}

export function useUpdateAdminUserPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: UserPlan }) =>
      updateAdminUserPlan(id, plan),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
      ]);
    },
  });
}
