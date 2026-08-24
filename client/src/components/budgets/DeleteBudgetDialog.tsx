import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import type { Budget } from "../../types/api";
import { getCategoryLabel } from "../../utils/categoryLabel";

type DeleteBudgetDialogProps = {
  open: boolean;
  budget: Budget | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteBudgetDialog({
  open,
  budget,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteBudgetDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !budget) return null;

  const categoryName = budget.category?.name
    ? getCategoryLabel(budget.category.name, t)
    : t("transactions.uncategorized");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-budget-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-bg-elevated p-6 shadow-card"
      >
        <h2 id="delete-budget-title" className="text-lg font-semibold text-fg">
          {t("budgets.deleteTitle")}
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          {t("budgets.deleteMessage", { category: categoryName })}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            text={t("common.cancel")}
            onClick={onClose}
            disabled={isDeleting}
          />
          <Button
            type="button"
            variant="danger"
            text={t("common.delete")}
            onClick={onConfirm}
            isLoading={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}

export default DeleteBudgetDialog;
