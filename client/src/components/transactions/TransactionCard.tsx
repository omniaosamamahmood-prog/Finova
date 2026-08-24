import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Category, Transaction } from "../../types/api";
import { formatCurrency, formatDate } from "../../utils/format";
import { getCategoryLabel } from "../../utils/categoryLabel";
import CardActions from "../ui/CardActions";

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
    <article className="ui-card ui-card-hover p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
              isIncome
                ? "bg-success-muted text-success"
                : "bg-danger-muted text-danger"
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="size-5" aria-hidden />
            ) : (
              <ArrowUpRight className="size-5" aria-hidden />
            )}
          </span>
          <div className="min-w-0 text-start">
            <h3 className="truncate text-base font-semibold text-fg">
              {transaction.title}
            </h3>
            <p className="mt-0.5 text-sm text-fg-muted">{categoryLabel}</p>
          </div>
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

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-full px-2.5 py-1 font-medium ${
            isIncome
              ? "bg-success-muted text-success"
              : "bg-danger-muted text-danger"
          }`}
        >
          {t(`transactions.types.${transaction.type}`)}
        </span>
        <span className="text-fg-subtle">
          {formatDate(transaction.transactionDate, i18n.language)}
        </span>
      </div>

      <CardActions
        onEdit={() => onEdit(transaction)}
        onDelete={() => onDelete(transaction)}
      />
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
