import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import TransactionForm from "./TransactionForm";
import type { Category, Transaction } from "../../types/api";
import type { TransactionFormData } from "../../validations/transaction.validation";

type TransactionModalProps = {
  open: boolean;
  transaction?: Transaction | null;
  categories: Category[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
};

function TransactionModal({
  open,
  transaction,
  categories,
  isSubmitting = false,
  onClose,
  onSubmit,
}: TransactionModalProps) {
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
        aria-labelledby="transaction-modal-title"
        className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-border bg-bg-elevated shadow-card-hover sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="transaction-modal-title"
            className="text-lg font-semibold text-fg"
          >
            {transaction
              ? t("transactions.editTitle")
              : t("transactions.addTitle")}
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
          <TransactionForm
            categories={categories}
            initialValues={transaction}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
