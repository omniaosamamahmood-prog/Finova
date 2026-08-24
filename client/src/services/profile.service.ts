import api from "./api";
import type {
  ApiSuccess,
  ChangePasswordPayload,
  Profile,
  UpdateProfilePayload,
} from "../types/api";

export async function fetchProfile(): Promise<Profile> {
  const response = await api.get<ApiSuccess<Profile>>("/profile");
  return response.data.data;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<Profile> {
  const form = new FormData();

  if (payload.fullName !== undefined) {
    form.append("fullName", payload.fullName);
  }

  if (payload.removeAvatar) {
    form.append("removeAvatar", "true");
  }

  if (payload.avatar) {
    form.append("avatar", payload.avatar);
  }

  const response = await api.put<ApiSuccess<Profile>>("/profile", form);
  return response.data.data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<void> {
  await api.post("/auth/change-password", payload);
}
