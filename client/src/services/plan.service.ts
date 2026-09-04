import api from "./api";
import type { ApiSuccess } from "../types/api";

export async function createCheckoutSession(): Promise<{ url: string }> {
  const response = await api.post<ApiSuccess<{ url: string }>>(
    "/plan/paymob/create-checkout"
  );
  const url = response.data.data?.url?.trim();

  if (!url) {
    throw new Error("Failed to create Paymob Checkout session");
  }

  return { url };
}
