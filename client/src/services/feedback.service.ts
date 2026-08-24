import api from "./api";
import type { ApiSuccess } from "../types/api";
import type { Feedback, FeedbackPayload } from "../types/feedback";

export async function submitFeedback(
  payload: FeedbackPayload
): Promise<Feedback> {
  const response = await api.post<ApiSuccess<Feedback>>("/feedback", payload);
  return response.data.data;
}

export async function fetchMyFeedback(): Promise<Feedback[]> {
  const response = await api.get<ApiSuccess<Feedback[]>>("/feedback/me");
  return response.data.data;
}
