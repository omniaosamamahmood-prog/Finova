import api from "./api";
import type { ApiSuccess, Category } from "../types/api";

export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<ApiSuccess<Category[]>>("/api/categories");
  return response.data.data;
}
