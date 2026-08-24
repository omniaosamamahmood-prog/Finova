import { useMutation } from "@tanstack/react-query";
import {
  loginWithGoogle,
  persistAuthSession,
  type AuthSession,
} from "../services/auth.service";

export function useGoogleLogin() {
  return useMutation({
    mutationFn: (credential: string) => loginWithGoogle(credential),
    onSuccess: (session: AuthSession) => {
      persistAuthSession(session);
    },
  });
}
