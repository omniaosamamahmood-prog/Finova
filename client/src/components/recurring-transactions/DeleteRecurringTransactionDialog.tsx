import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import type { RecurringTransaction } from "../../types/api";

type DeleteRecurringTransactionDialogProps = {
  open: boolean;
  item: RecurringTransaction | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteRecurringTransactionDialog({
  open,
  item,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteRecurringTransactionDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !item) return null;

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
        aria-labelledby="delete-recurring-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-bg-elevated p-6 shadow-card"
      >
        <h2
          id="delete-recurring-title"
          className="text-lg font-semibold text-fg"
        >
          {t("recurring.deleteTitle")}
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          {t("recurring.deleteMessage", { title: item.title })}
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

export default DeleteRecurringTransactionDialog;
