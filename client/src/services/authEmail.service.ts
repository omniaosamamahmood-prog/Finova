import axios from "axios";
import api from "./api";
import type { ApiErrorBody, ApiSuccess } from "../types/api";

export type MessageResult = {
  message?: string;
};

export type VerifyEmailResult = {
  status: "success" | "expired" | "failed";
  message?: string;
};
//handle forgot password fi
export async function forgotPassword(email: string): Promise<MessageResult> {
  const response = await api.post<ApiSuccess<null> & { message?: string }>(
    "/auth/forgot-password",
    { email }
  );
  return { message: response.data.message };
}

export async function resetPassword(payload: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<MessageResult> {
  const response = await api.post<ApiSuccess<null> & { message?: string }>(
    "/auth/reset-password",
    payload
  );
  return { message: response.data.message };
}

export async function resendVerification(email: string): Promise<MessageResult> {
  const response = await api.post<ApiSuccess<null> & { message?: string }>(
    "/auth/resend-verification",
    { email }
  );
  return { message: response.data.message };
}

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  try {
    const response = await api.get<
      ApiSuccess<null> & { status?: string; message?: string }
    >("/auth/verify-email", {
      params: { token, format: "json" },
      headers: { Accept: "application/json" },
    });
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError<ApiErrorBody & { status?: string }>(error)) {
      const status = error.response?.data?.status;
      if (status === "expired" || status === "failed" || status === "success") {
        return {
          status,
          message: error.response?.data?.message,
        };
      }
    }
    return { status: "failed" };
  }
}

export async function changePasswordAuth(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<MessageResult> {
  const response = await api.post<ApiSuccess<null> & { message?: string }>(
    "/auth/change-password",
    payload
  );
  return { message: response.data.message };
}
