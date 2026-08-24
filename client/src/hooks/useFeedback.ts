import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { submitFeedback } from "../services/feedback.service";
import type { FeedbackPayload } from "../types/feedback";

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FeedbackPayload) => submitFeedback(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.myFeedback });
    },
  });
}
