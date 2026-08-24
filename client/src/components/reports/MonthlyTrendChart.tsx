import { ChartColumn } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReportSection from "./ReportSection";
import { TrendTooltip } from "./ChartTooltips";
import ErrorBanner from "../ui/ErrorBanner";
import { useChartTheme } from "../../hooks/useChartTheme";
import type { MonthlyTrendPoint } from "../../types/api";
import { formatCompactNumber, getMonthLabel } from "../../utils/format";

type MonthlyTrendChartProps = {
  points: MonthlyTrendPoint[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
};

function MonthlyTrendChart({
  points,
  isLoading,
  isError,
  error,
  onRetry,
}: MonthlyTrendChartProps) {
  const { t, i18n } = useTranslation();
  const colors = useChartTheme();
  const isRtl = i18n.dir() === "rtl";

  const data = points.map((point) => ({
    ...point,
    label: getMonthLabel(point.month, i18n.language, "short"),
  }));

  const hasActivity = points.some(
    (point) => point.income > 0 || point.expense > 0
  );

  return (
    <ReportSection title={t("reports.monthlyTrend")} icon={ChartColumn}>
      {isLoading && (
        <>
          <span className="sr-only">{t("common.loading")}</span>
          <div className="h-72 animate-pulse rounded-2xl bg-surface-hover" aria-hidden />
        </>
      )}

      {isError && <ErrorBanner error={error} onRetry={onRetry} />}

      {!isLoading && !isError && !hasActivity && (
        <p className="text-sm leading-relaxed text-fg-muted">
          {t("reports.trendEmpty")}
        </p>
      )}

      {!isLoading && !isError && hasActivity && (
        <div className="h-72 w-full min-w-0" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 12,
                right: isRtl ? 8 : 16,
                left: isRtl ? 16 : 8,
                bottom: 4,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.border}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                reversed={isRtl}
                tick={{ fill: colors.fgMuted, fontSize: 12 }}
                axisLine={{ stroke: colors.border }}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                orientation={isRtl ? "right" : "left"}
                tick={{ fill: colors.fgMuted, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) =>
                  formatCompactNumber(value, i18n.language)
                }
                width={isRtl ? 64 : 52}
              />
              <Tooltip content={TrendTooltip} />
              <Legend
                wrapperStyle={{
                  direction: isRtl ? "rtl" : "ltr",
                  paddingTop: 12,
                  color: colors.fgMuted,
                  fontSize: 13,
                }}
                formatter={(value) => (
                  <span className="text-fg-muted">{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="income"
                name={t("reports.income")}
                stroke={colors.success}
                strokeWidth={2.5}
                dot={{ r: 3, fill: colors.success, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name={t("reports.expense")}
                stroke={colors.danger}
                strokeWidth={2.5}
                dot={{ r: 3, fill: colors.danger, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ReportSection>
  );
}

export default MonthlyTrendChart;
