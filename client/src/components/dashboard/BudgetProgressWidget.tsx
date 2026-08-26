import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Wallet } from "lucide-react";
import { useBudgets } from "../../hooks/useBudgets";
import { getCategoryLabel } from "../../utils/categoryLabel";
import {
  getBudgetBarWidth,
  getBudgetProgressTone,
} from "../../utils/budgetProgress";
import WidgetEmptyState from "./WidgetEmptyState";

function BudgetProgressWidget() {
  const { t } = useTranslation();
  const { data: budgets = [], isLoading, isError } = useBudgets();

  const topBudgets = [...budgets]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  return (
    <section className="ui-card h-full p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary-muted text-primary">
            <Wallet className="size-4" aria-hidden />
          </span>
          <h3 className="text-base font-semibold text-fg">
            {t("dashboard.budgetProgress")}
          </h3>
        </div>
        <Link
          to="/budgets"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("dashboard.viewAll")}
        </Link>
      </div>

      {isLoading && (
        <div className="mt-5 space-y-4" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse space-y-2">
              <div className="h-3 w-24 rounded bg-surface-hover" />
              <div className="h-2 rounded-full bg-surface-hover" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-5 text-sm text-danger">{t("errors.somethingWrong")}</p>
      )}

      {!isLoading && !isError && topBudgets.length === 0 && (
        <WidgetEmptyState
          title={t("dashboard.onboarding.budgetEmptyTitle")}
          description={t("dashboard.onboarding.budgetEmptyDescription")}
          actionTo="/budgets"
          actionLabel={t("dashboard.onboarding.createBudget")}
        />
      )}

      {!isLoading && !isError && topBudgets.length > 0 && (
        <ul className="mt-5 space-y-5">
          {topBudgets.map((budget) => {
            const tone = getBudgetProgressTone(budget.progress);
            const barWidth = getBudgetBarWidth(budget.progress);
            const barClass =
              tone === "over"
                ? "bg-danger"
                : tone === "warn"
                  ? "bg-warning"
                  : "bg-primary";
            const name = budget.category?.name
              ? getCategoryLabel(budget.category.name, t)
              : t("transactions.uncategorized");

            return (
              <li key={budget.id}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-fg">{name}</span>
                  <span
                    className={`shrink-0 font-semibold tabular-nums ${
                      tone === "over" ? "text-danger" : "text-fg-muted"
                    }`}
                  >
                    {budget.progress.toFixed(budget.progress % 1 === 0 ? 0 : 1)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
                  <div
                    className={`h-full rounded-full ${barClass}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default BudgetProgressWidget;
