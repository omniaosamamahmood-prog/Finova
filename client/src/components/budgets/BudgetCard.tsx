import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Budget } from "../../types/api";
import { formatCurrency } from "../../utils/format";
import { getCategoryLabel } from "../../utils/categoryLabel";
import {
  getBudgetBarWidth,
  getBudgetProgressTone,
} from "../../utils/budgetProgress";
import CardActions from "../ui/CardActions";

type BudgetCardProps = {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
};

function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { t, i18n } = useTranslation();
  const tone = getBudgetProgressTone(budget.progress);
  const barWidth = getBudgetBarWidth(budget.progress);
  const categoryName = budget.category?.name
    ? getCategoryLabel(budget.category.name, t)
    : t("transactions.uncategorized");

  const barClass =
    tone === "over"
      ? "bg-danger"
      : tone === "warn"
        ? "bg-warning"
        : "bg-primary";

  return (
    <article className="ui-card ui-card-hover p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
              tone === "over"
                ? "bg-danger-muted text-danger"
                : "bg-primary-muted text-primary"
            }`}
          >
            <Wallet className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 text-start">
            <h3 className="truncate text-base font-semibold text-fg">
              {categoryName}
            </h3>
            {tone === "over" && (
              <p className="mt-1 text-sm font-medium text-danger">
                {t("budgets.exceeded")}
              </p>
            )}
          </div>
        </div>

        <p
          className={`shrink-0 rounded-full px-2.5 py-1 text-sm font-semibold tabular-nums ${
            tone === "over"
              ? "bg-danger-muted text-danger"
              : "bg-surface-hover text-fg"
          }`}
        >
          {budget.progress.toFixed(budget.progress % 1 === 0 ? 0 : 1)}%
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">{t("budgets.labels.budget")}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-fg">
            {formatCurrency(budget.amount, i18n.language)}
          </dd>
        </div>
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">{t("budgets.labels.spent")}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-fg">
            {formatCurrency(budget.spent, i18n.language)}
          </dd>
        </div>
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">{t("budgets.labels.remaining")}</dt>
          <dd
            className={`mt-0.5 font-semibold tabular-nums ${
              budget.remaining < 0 ? "text-danger" : "text-success"
            }`}
          >
            {formatCurrency(budget.remaining, i18n.language)}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <div
          className="h-2 overflow-hidden rounded-full bg-surface-hover"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(barWidth)}
          aria-label={t("budgets.labels.progress")}
        >
          <div
            className={`h-full rounded-full transition-[width] ${barClass}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      <CardActions
        onEdit={() => onEdit(budget)}
        onDelete={() => onDelete(budget)}
      />
    </article>
  );
}

export default BudgetCard;
