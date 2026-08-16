import axios from "axios";
import type { ApiErrorBody } from "../types/api";

export function getErrorMessage(
  error: unknown,
  fallback = "errors.somethingWrong"
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return "errors.network";
    }

    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      return "errors.unauthorized";
    }

    if (data?.errors?.length) {
      return data.errors[0];
    }

    if (data?.message) {
      return data.message;
    }

    if (status >= 500) {
      return "errors.server";
    }

    return "errors.validation";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
