import api from "./api";
import type { ApiSuccess, Category, CategoryPayload } from "../types/api";

export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<ApiSuccess<Category[]>>("/categories");
  return response.data.data;
}

export async function fetchCategoryById(id: string): Promise<Category> {
  const response = await api.get<ApiSuccess<Category>>(`/categories/${id}`);
  return response.data.data;
}

export async function createCategory(
  payload: CategoryPayload
): Promise<Category> {
  const response = await api.post<ApiSuccess<Category>>("/categories", payload);
  return response.data.data;
}

export async function updateCategory(
  id: string,
  payload: CategoryPayload
): Promise<Category> {
  const response = await api.put<ApiSuccess<Category>>(
    `/categories/${id}`,
    payload
  );
  return response.data.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
