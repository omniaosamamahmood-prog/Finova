import api from "./api";
import type { ApiSuccess, Profile } from "../types/api";
import { recordSuccessfulLogin } from "../utils/feedbackPrompt";

export type AuthSession = {
  user: Profile & { updatedAt?: string };
  token: string;
};

export async function loginWithGoogle(
  credential: string
): Promise<AuthSession> {
  const response = await api.post<ApiSuccess<AuthSession>>("/auth/google", {
    credential,
  });
  return response.data.data;
}

export function persistAuthSession(session: AuthSession) {
  localStorage.setItem("token", session.token);
  localStorage.setItem("user", JSON.stringify(session.user));
  if (session.user.id) {
    recordSuccessfulLogin(session.user.id);
  }
}
