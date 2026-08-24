import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { useProfile } from "./useProfile";
import {
  fetchAdminFeedback,
  fetchAdminOverview,
  fetchAdminUsers,
} from "../services/admin.service";

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
