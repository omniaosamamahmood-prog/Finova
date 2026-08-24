import api from "./api";

export type AiChatLanguage = "en" | "ar";

export type AiChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type AiChatPayload = {
  message: string;
  language: AiChatLanguage;
  history?: AiChatHistoryItem[];
};

type AiChatResponse = {
  success: boolean;
  answer: string;
};

export async function sendAiChat(
  payload: AiChatPayload
): Promise<AiChatResponse> {
  const { data } = await api.post<AiChatResponse>("/ai/chat", payload);
  return data;
}
