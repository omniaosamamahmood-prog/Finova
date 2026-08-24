import { Pencil, Pause, Play, Repeat, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { RecurringTransaction } from "../../types/api";
import { formatCurrency, formatUtcDate } from "../../utils/format";
import { getCategoryLabel } from "../../utils/categoryLabel";

type RecurringTransactionCardProps = {
  item: RecurringTransaction;
  onEdit: (item: RecurringTransaction) => void;
  onDelete: (item: RecurringTransaction) => void;
  onToggle: (item: RecurringTransaction) => void;
  isToggling?: boolean;
};

function RecurringTransactionCard({
  item,
  onEdit,
  onDelete,
  onToggle,
  isToggling = false,
}: RecurringTransactionCardProps) {
  const { t, i18n } = useTranslation();
  const isIncome = item.type === "INCOME";
  const categoryName = item.category?.name
    ? getCategoryLabel(item.category.name, t)
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
            <Repeat className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 text-start">
            <h3 className="truncate text-base font-semibold text-fg">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-fg-muted">{categoryName}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            item.isActive
              ? "bg-success-muted text-success"
              : "bg-surface-hover text-fg-muted"
          }`}
        >
          {item.isActive ? t("recurring.active") : t("recurring.paused")}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">{t("recurring.labels.amount")}</dt>
          <dd
            className={`mt-0.5 font-semibold tabular-nums ${
              isIncome ? "text-success" : "text-danger"
            }`}
          >
            {formatCurrency(item.amount, i18n.language)}
          </dd>
        </div>
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">
            {t("recurring.labels.frequency")}
          </dt>
          <dd className="mt-0.5 font-semibold text-fg">
            {t(`recurring.frequency.${item.frequency}`)}
          </dd>
        </div>
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">{t("recurring.labels.type")}</dt>
          <dd className="mt-0.5 font-semibold text-fg">
            {t(`transactions.types.${item.type}`)}
          </dd>
        </div>
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">
            {t("recurring.labels.nextRun")}
          </dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-fg">
            {formatUtcDate(item.nextRunAt, i18n.language)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-1.5 border-t border-border-subtle pt-3">
        <button
          type="button"
          onClick={() => onToggle(item)}
          disabled={isToggling}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-fg-muted transition hover:bg-surface-hover hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
        >
          {item.isActive ? (
            <Pause className="size-3.5" aria-hidden />
          ) : (
            <Play className="size-3.5" aria-hidden />
          )}
          {item.isActive ? t("recurring.pause") : t("recurring.resume")}
        </button>
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-fg-muted transition hover:bg-surface-hover hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Pencil className="size-3.5" aria-hidden />
          {t("common.edit")}
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-danger transition hover:bg-danger-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
        >
          <Trash2 className="size-3.5" aria-hidden />
          {t("common.delete")}
        </button>
      </div>
    </article>
  );
}

export default RecurringTransactionCard;
