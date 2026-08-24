import api from "./api";
import type { ApiSuccess, Goal, GoalPayload } from "../types/api";

export async function fetchGoals(): Promise<Goal[]> {
  const response = await api.get<ApiSuccess<Goal[]>>("/goals");
  return response.data.data;
}

export async function fetchGoalById(id: string): Promise<Goal> {
  const response = await api.get<ApiSuccess<Goal>>(`/goals/${id}`);
  return response.data.data;
}

export async function createGoal(payload: GoalPayload): Promise<Goal> {
  const response = await api.post<ApiSuccess<Goal>>("/goals", payload);
  return response.data.data;
}

export async function updateGoal(
  id: string,
  payload: GoalPayload
): Promise<Goal> {
  const response = await api.put<ApiSuccess<Goal>>(`/goals/${id}`, payload);
  return response.data.data;
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(`/goals/${id}`);
}
