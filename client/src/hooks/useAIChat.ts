import { useMutation } from "@tanstack/react-query";
import {
  sendAiChat,
  type AiChatPayload,
} from "../services/ai.service";

export function useAIChat() {
  return useMutation({
    mutationFn: (payload: AiChatPayload) => sendAiChat(payload),
  });
}
