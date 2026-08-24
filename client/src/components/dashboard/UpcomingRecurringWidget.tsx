import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Repeat } from "lucide-react";
import { useRecurringTransactions } from "../../hooks/useRecurringTransactions";
import { formatCurrency, formatUtcDate } from "../../utils/format";

function UpcomingRecurringWidget() {
  const { t, i18n } = useTranslation();
  const { data: items = [], isLoading, isError } = useRecurringTransactions();

  const upcoming = [...items]
    .filter((item) => item.isActive)
    .sort(
      (a, b) =>
        new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime()
    )
    .slice(0, 3);

  return (
    <section className="ui-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-muted text-primary">
            <Repeat className="size-4" aria-hidden />
          </span>
          <h3 className="truncate text-base font-semibold text-fg">
            {t("dashboard.upcomingRecurring")}
          </h3>
        </div>
        <Link
          to="/recurring-transactions"
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          {t("dashboard.viewAll")}
        </Link>
      </div>

      {isLoading && (
        <div className="mt-5 space-y-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-10 animate-pulse rounded-xl bg-surface-hover"
            />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-5 text-sm text-danger">{t("errors.somethingWrong")}</p>
      )}

      {!isLoading && !isError && upcoming.length === 0 && (
        <p className="mt-5 text-sm leading-relaxed text-fg-muted">
          {t("dashboard.noRecurringYet")}
        </p>
      )}

      {!isLoading && !isError && upcoming.length > 0 && (
        <ul className="mt-5 divide-y divide-border">
          {upcoming.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 text-start">
                <p className="truncate text-sm font-medium text-fg">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  {formatUtcDate(item.nextRunAt, i18n.language)}
                </p>
              </div>
              <p
                className={`shrink-0 text-sm font-semibold tabular-nums ${
                  item.type === "INCOME" ? "text-success" : "text-danger"
                }`}
              >
                {formatCurrency(item.amount, i18n.language)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default UpcomingRecurringWidget;
