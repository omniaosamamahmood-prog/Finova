import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircleHeart } from "lucide-react";
import FeedbackDialog from "./FeedbackDialog";
import FeedbackPrompt from "./FeedbackPrompt";
import { fetchMyFeedback } from "../../services/feedback.service";
import { getStoredUser } from "../../utils/storedUser";
import {
  dismissFeedbackPrompt,
  markPromptShownThisSession,
  recordAppVisit,
  shouldOfferFeedbackPrompt,
  wasSubmittedRecently,
} from "../../utils/feedbackPrompt";
import { useFeedbackDialog } from "../../hooks/useFeedbackDialog";

function FeedbackButton() {
  const { t } = useTranslation();
  const {
    open: dialogOpen,
    openDialog,
    closeDialog,
    isSubmitting,
    submit,
  } = useFeedbackDialog();
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
        onClick={openDialog}
        className="fixed bottom-[4.75rem] end-5 z-40 hidden items-center gap-2 rounded-2xl border border-border bg-bg-elevated px-4 py-3 text-sm font-semibold text-fg shadow-card transition hover:border-primary/40 hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:inline-flex sm:bottom-[5.25rem] sm:end-6"
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
          openDialog();
        }}
        onDismiss={handleDismissPrompt}
      />

      <FeedbackDialog
        open={dialogOpen}
        isSubmitting={isSubmitting}
        onClose={closeDialog}
        onSubmit={(data) => {
          void submit(data).then((ok) => {
            if (ok) setPromptOpen(false);
          });
        }}
      />
    </>
  );
}

export default FeedbackButton;
