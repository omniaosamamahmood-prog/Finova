import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Category, Transaction } from "../../types/api";
import { formatCurrency, formatDate } from "../../utils/format";
import { getCategoryLabel } from "../../utils/categoryLabel";

type TransactionCardProps = {
  transaction: Transaction;
  categoryKey?: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

function TransactionCard({
  transaction,
  categoryKey,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const { t, i18n } = useTranslation();
  const isIncome = transaction.type === "INCOME";
  const categoryLabel = categoryKey
    ? getCategoryLabel(categoryKey, t)
    : t("transactions.uncategorized");

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-start">
          <h3 className="truncate text-base font-semibold text-fg">
            {transaction.title}
          </h3>
          <p className="mt-1 text-sm text-fg-muted">{categoryLabel}</p>
        </div>

        <p
          className={`shrink-0 text-base font-bold tabular-nums ${
            isIncome ? "text-success" : "text-danger"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount, i18n.language)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded-lg px-2.5 py-1 font-medium ${
              isIncome
                ? "bg-success/15 text-success"
                : "bg-danger-muted text-danger"
            }`}
          >
            {t(`transactions.types.${transaction.type}`)}
          </span>
          <span className="text-fg-subtle">
            {formatDate(transaction.transactionDate, i18n.language)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted transition hover:bg-surface-hover hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Pencil className="size-3.5" aria-hidden />
            {t("common.edit")}
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger-muted px-3 py-1.5 text-sm text-danger transition hover:bg-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          >
            <Trash2 className="size-3.5" aria-hidden />
            {t("common.delete")}
          </button>
        </div>
      </div>
    </article>
  );
}

export function resolveCategoryKey(
  transaction: Transaction,
  categories: Category[]
): string | undefined {
  if (transaction.category?.name) {
    return transaction.category.name;
  }

  return categories.find((category) => category.id === transaction.categoryId)
    ?.name;
}

export default TransactionCard;
