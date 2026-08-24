import { ChartPie } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ReportSection from "./ReportSection";
import { ExpenseCategoryTooltip } from "./ChartTooltips";
import ErrorBanner from "../ui/ErrorBanner";
import { useChartTheme } from "../../hooks/useChartTheme";
import type { ReportCategoryAmount } from "../../types/api";
import { getCategoryLabel } from "../../utils/categoryLabel";
import { formatCurrency, formatPercent } from "../../utils/format";
import { getCategoryColor } from "../../utils/reportChart";

type ExpenseByCategoryChartProps = {
  items: ReportCategoryAmount[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
};

function ExpenseByCategoryChart({
  items,
  isLoading,
  isError,
  error,
  onRetry,
}: ExpenseByCategoryChartProps) {
  const { t, i18n } = useTranslation();
  const colors = useChartTheme();

  const data = items.map((item, index) => ({
    name: getCategoryLabel(item.category, t),
    amount: item.amount,
    percentage: item.percentage,
    fill: getCategoryColor(index),
  }));

  return (
    <ReportSection title={t("reports.expenseByCategory")} icon={ChartPie}>
      {isLoading && (
        <div className="h-64 animate-pulse rounded-2xl bg-surface-hover" aria-hidden />
      )}

      {isError && <ErrorBanner error={error} onRetry={onRetry} />}

      {!isLoading && !isError && data.length === 0 && (
        <p className="text-sm leading-relaxed text-fg-muted">
          {t("reports.chartEmpty")}
        </p>
      )}

      {!isLoading && !isError && data.length > 0 && (
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
          <div className="h-64 w-full min-w-0 xl:w-1/2" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke={colors.surface}
                  strokeWidth={3}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={ExpenseCategoryTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="min-w-0 flex-1 space-y-3">
            {data.map((entry) => (
              <li
                key={entry.name}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                    aria-hidden
                  />
                  <span className="truncate font-medium text-fg">{entry.name}</span>
                </span>
                <span className="shrink-0 text-end tabular-nums text-fg-muted">
                  {formatCurrency(entry.amount, i18n.language)}
                  <span className="ms-2 text-fg-subtle">
                    {formatPercent(entry.percentage, i18n.language)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ReportSection>
  );
}

export default ExpenseByCategoryChart;
