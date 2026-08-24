import { Star, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

type FeedbackPromptProps = {
  open: boolean;
  onLeaveFeedback: () => void;
  onDismiss: () => void;
};

function FeedbackPrompt({
  open,
  onLeaveFeedback,
  onDismiss,
}: FeedbackPromptProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={onDismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-prompt-title"
        className="enter enter-up relative z-10 w-full max-w-md rounded-t-3xl border border-border bg-bg-elevated p-5 shadow-card sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary-muted text-primary">
            <Star className="size-5 fill-primary" aria-hidden />
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-2 text-fg-muted transition hover:bg-surface hover:text-fg"
          >
            <X className="size-5" aria-hidden />
            <span className="sr-only">{t("common.close")}</span>
          </button>
        </div>

        <h2
          id="feedback-prompt-title"
          className="text-lg font-semibold text-fg"
        >
          {t("feedback.prompt.title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("feedback.prompt.body")}</p>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            text={t("feedback.prompt.later")}
            onClick={onDismiss}
          />
          <Button
            type="button"
            text={t("feedback.prompt.leave")}
            onClick={onLeaveFeedback}
          />
        </div>
      </div>
    </div>
  );
}

export default FeedbackPrompt;
