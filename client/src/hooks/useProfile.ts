import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import {
  changePassword,
  fetchProfile,
  updateProfile,
} from "../services/profile.service";
import type { ChangePasswordPayload, UpdateProfilePayload } from "../types/api";
import { persistStoredUser } from "../utils/storedUser";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const profile = await fetchProfile();
      persistStoredUser(profile);
      return profile;
    },
    enabled: Boolean(localStorage.getItem("token")),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: async (profile) => {
      persistStoredUser(profile);
      queryClient.setQueryData(queryKeys.profile, profile);
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
}
