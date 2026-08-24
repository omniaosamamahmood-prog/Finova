import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import type { Category } from "../../types/api";
import { getCategoryLabel } from "../../utils/categoryLabel";

export type CategoryDeleteBlock = "transactions" | "budget" | null;

type DeleteCategoryDialogProps = {
  open: boolean;
  category: Category | null;
  blockedBy?: CategoryDeleteBlock;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteCategoryDialog({
  open,
  category,
  blockedBy = null,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !category) return null;

  const label = getCategoryLabel(category.name, t);
  const blocked =
    blockedBy === "transactions"
      ? t("categories.errors.hasTransactions")
      : blockedBy === "budget"
        ? t("categories.errors.hasBudget")
        : null;

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
        aria-labelledby="delete-category-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-bg-elevated p-6 shadow-card"
      >
        <h2
          id="delete-category-title"
          className="text-lg font-semibold text-fg"
        >
          {t("categories.deleteTitle")}
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          {blocked
            ? blocked
            : t("categories.deleteMessage", { name: label })}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            text={t("common.cancel")}
            onClick={onClose}
            disabled={isDeleting}
          />
          {!blocked && (
            <Button
              type="button"
              variant="danger"
              text={t("common.delete")}
              onClick={onConfirm}
              isLoading={isDeleting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteCategoryDialog;
