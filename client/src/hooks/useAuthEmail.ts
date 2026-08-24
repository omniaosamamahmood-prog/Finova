import { useMutation } from "@tanstack/react-query";
import {
  changePasswordAuth,
  forgotPassword,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "../services/authEmail.service";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => resetPassword(payload),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => changePasswordAuth(payload),
  });
}
