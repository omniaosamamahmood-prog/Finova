import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReportSection from "./ReportSection";
import ErrorBanner from "../ui/ErrorBanner";
import type { TopSpendingCategory } from "../../types/api";
import { getCategoryLabel } from "../../utils/categoryLabel";
import { formatCurrency } from "../../utils/format";
import { getCategoryColor } from "../../utils/reportChart";

type TopCategoriesListProps = {
  items: TopSpendingCategory[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
};

function TopCategoriesList({
  items,
  isLoading,
  isError,
  error,
  onRetry,
}: TopCategoriesListProps) {
  const { t, i18n } = useTranslation();
  const maxAmount = items[0]?.amount ?? 0;

  return (
    <ReportSection title={t("reports.topCategories")} icon={Trophy}>
      {isLoading && (
        <div className="space-y-5" aria-hidden>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse space-y-2">
              <div className="h-3 w-24 rounded bg-surface-hover" />
              <div className="h-2.5 rounded-full bg-surface-hover" />
            </div>
          ))}
        </div>
      )}

      {isError && <ErrorBanner error={error} onRetry={onRetry} />}

      {!isLoading && !isError && items.length === 0 && (
        <p className="text-sm leading-relaxed text-fg-muted">
          {t("reports.topEmpty")}
        </p>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <ol className="space-y-5">
          {items.map((item, index) => {
            const width =
              maxAmount > 0 ? Math.min((item.amount / maxAmount) * 100, 100) : 0;
            const name = getCategoryLabel(item.category, t);

            return (
              <li key={item.category}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-5 shrink-0 text-xs font-semibold tabular-nums text-fg-subtle">
                      {index + 1}
                    </span>
                    <span className="truncate font-medium text-fg">{name}</span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-fg-muted">
                    {formatCurrency(item.amount, i18n.language)}
                  </span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-hover">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${width}%`,
                      backgroundColor: getCategoryColor(index),
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </ReportSection>
  );
}

export default TopCategoriesList;
