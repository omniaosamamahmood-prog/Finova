import api from "./api";
import type { ApiSuccess } from "../types/api";
import type {
  AdminFeedbackItem,
  AdminOverview,
  AdminUser,
} from "../types/admin";

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const response = await api.get<ApiSuccess<AdminOverview>>("/admin/overview");
  return response.data.data;
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const response = await api.get<ApiSuccess<AdminUser[]>>("/admin/users");
  return response.data.data;
}

export async function fetchAdminFeedback(): Promise<AdminFeedbackItem[]> {
  const response =
    await api.get<ApiSuccess<AdminFeedbackItem[]>>("/admin/feedback");
  return response.data.data;
}
