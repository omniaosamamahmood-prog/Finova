import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSubmitFeedback } from "./useFeedback";
import { useToast } from "../components/ui/Toast";
import { getBrowserInfo } from "../utils/browserInfo";
import { getErrorMessage } from "../utils/errorMessage";
import { getStoredUser } from "../utils/storedUser";
import { markFeedbackSubmitted } from "../utils/feedbackPrompt";
import type { FeedbackFormData } from "../validations/feedback.validation";

export function useFeedbackDialog() {
  const { t } = useTranslation();
  const location = useLocation();
  const { showToast } = useToast();
  const submitMutation = useSubmitFeedback();
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const submit = async (data: FeedbackFormData) => {
    const userId = getStoredUser().id;

    try {
      await submitMutation.mutateAsync({
        rating: data.rating,
        type: data.type,
        message: data.message.trim(),
        featureRequest: data.featureRequest?.trim() || undefined,
        page: location.pathname,
        browser: getBrowserInfo() || undefined,
      });

      if (userId) {
        markFeedbackSubmitted(userId);
      }

      showToast(t("feedback.success"), "success");
      setOpen(false);
      return true;
    } catch (error) {
      const messageKey = getErrorMessage(error, "feedback.errors.submitFailed");
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
      return false;
    }
  };

  return {
    open,
    openDialog,
    closeDialog,
    setOpen,
    isSubmitting: submitMutation.isPending,
    submit,
  };
}
