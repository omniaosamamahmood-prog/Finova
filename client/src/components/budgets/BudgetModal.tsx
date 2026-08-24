import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import BudgetForm from "./BudgetForm";
import type { Budget, Category } from "../../types/api";
import type { BudgetFormData } from "../../validations/budget.validation";

type BudgetModalProps = {
  open: boolean;
  budget?: Budget | null;
  categories: Category[];
  budgets: Budget[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
};

function BudgetModal({
  open,
  budget,
  categories,
  budgets,
  isSubmitting = false,
  onClose,
  onSubmit,
}: BudgetModalProps) {
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
        aria-labelledby="budget-modal-title"
        className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-border bg-bg-elevated shadow-card sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="budget-modal-title" className="text-lg font-semibold text-fg">
            {budget ? t("budgets.editTitle") : t("budgets.addTitle")}
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
          <BudgetForm
            categories={categories}
            budgets={budgets}
            initialValues={budget}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default BudgetModal;
