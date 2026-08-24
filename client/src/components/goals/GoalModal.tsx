import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import GoalForm from "./GoalForm";
import type { Goal } from "../../types/api";
import type { GoalFormData } from "../../validations/goal.validation";

type GoalModalProps = {
  open: boolean;
  goal?: Goal | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
};

function GoalModal({
  open,
  goal,
  isSubmitting = false,
  onClose,
  onSubmit,
}: GoalModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-modal-title"
        className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-border bg-bg-elevated shadow-card sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="goal-modal-title" className="text-lg font-semibold text-fg">
            {goal ? t("goals.editTitle") : t("goals.addTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-fg-muted transition hover:bg-surface hover:text-fg"
          >
            <X className="size-5" aria-hidden />
            <span className="sr-only">{t("common.close")}</span>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <GoalForm
            initialValues={goal}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default GoalModal;
