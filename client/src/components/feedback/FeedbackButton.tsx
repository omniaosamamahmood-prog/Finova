import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageCircleHeart } from "lucide-react";
import FeedbackDialog from "./FeedbackDialog";
import FeedbackPrompt from "./FeedbackPrompt";
import { useSubmitFeedback } from "../../hooks/useFeedback";
import { useToast } from "../ui/Toast";
import { fetchMyFeedback } from "../../services/feedback.service";
import { getErrorMessage } from "../../utils/errorMessage";
import { getBrowserInfo } from "../../utils/browserInfo";
import { getStoredUser } from "../../utils/storedUser";
import {
  dismissFeedbackPrompt,
  markFeedbackSubmitted,
  markPromptShownThisSession,
  recordAppVisit,
  shouldOfferFeedbackPrompt,
  wasSubmittedRecently,
} from "../../utils/feedbackPrompt";
import type { FeedbackFormData } from "../../validations/feedback.validation";

function FeedbackButton() {
  const { t } = useTranslation();
  const location = useLocation();
  const { showToast } = useToast();
  const submitMutation = useSubmitFeedback();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    const userId = getStoredUser().id;
    if (!userId) return;

    recordAppVisit(userId);

    if (!shouldOfferFeedbackPrompt(userId)) return;

    let cancelled = false;

    const maybePrompt = async () => {
      try {
        const items = await fetchMyFeedback();
        if (cancelled) return;
        const latest = items[0]?.createdAt ?? null;
        if (wasSubmittedRecently(userId, latest)) return;
      } catch {
        return;
      }

      if (cancelled) return;
      markPromptShownThisSession(userId);
      setPromptOpen(true);
    };

    const timer = window.setTimeout(() => {
      void maybePrompt();
    }, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const closeDialog = () => setDialogOpen(false);

  const handleSubmit = async (data: FeedbackFormData) => {
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
      setDialogOpen(false);
      setPromptOpen(false);
    } catch (error) {
      const messageKey = getErrorMessage(error, "feedback.errors.submitFailed");
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  const handleDismissPrompt = () => {
    const userId = getStoredUser().id;
    if (userId) {
      dismissFeedbackPrompt(userId);
    }
    setPromptOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-[4.75rem] end-5 z-40 inline-flex items-center gap-2 rounded-2xl border border-border bg-bg-elevated px-4 py-3 text-sm font-semibold text-fg shadow-card transition hover:border-primary/40 hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-[5.25rem] sm:end-6"
        aria-haspopup="dialog"
        aria-expanded={dialogOpen}
      >
        <MessageCircleHeart className="size-5 text-primary" aria-hidden />
        <span>{t("feedback.button")}</span>
      </button>

      <FeedbackPrompt
        open={promptOpen && !dialogOpen}
        onLeaveFeedback={() => {
          setPromptOpen(false);
          setDialogOpen(true);
        }}
        onDismiss={handleDismissPrompt}
      />

      <FeedbackDialog
        open={dialogOpen}
        isSubmitting={submitMutation.isPending}
        onClose={closeDialog}
        onSubmit={(data) => {
          void handleSubmit(data);
        }}
      />
    </>
  );
}

export default FeedbackButton;
