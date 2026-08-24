import { useMemo, useState } from "react";
import { ChartPie, Folders, TrendingDown, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import SummaryCard from "../components/dashboard/SummaryCard";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorBanner from "../components/ui/ErrorBanner";
import ReportFilters from "../components/reports/ReportFilters";
import ExportReportButton from "../components/reports/ExportReportButton";
import ReportSkeleton from "../components/reports/ReportSkeleton";
import ExpenseByCategoryChart from "../components/reports/ExpenseByCategoryChart";
import MonthlyTrendChart from "../components/reports/MonthlyTrendChart";
import TopCategoriesList from "../components/reports/TopCategoriesList";
import {
  useMonthlyTrend,
  useReportSummary,
  useTopCategories,
} from "../hooks/useReports";
import { getCategoryLabel } from "../utils/categoryLabel";
import { formatCurrency, getMonthLabel } from "../utils/format";

function getInitialPeriod() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

function ReportsPage() {
  const { t, i18n } = useTranslation();
  const [{ month, year }, setPeriod] = useState(getInitialPeriod);

  const summaryQuery = useReportSummary(month, year);
  const trendQuery = useMonthlyTrend(year);
  const topQuery = useTopCategories(month, year);

  const periodLabel = t("reports.period", {
    month: getMonthLabel(month, i18n.language, "long"),
    year,
  });

  const expensesByCategory = summaryQuery.data?.expensesByCategory ?? [];
  const totalExpense = summaryQuery.data?.totalExpense ?? 0;
  const hasMonthData = totalExpense > 0 || expensesByCategory.length > 0;

  const highestCategory = useMemo(() => {
    if (expensesByCategory.length === 0) return null;
    return expensesByCategory.reduce((highest, item) =>
      item.amount > highest.amount ? item : highest
    );
  }, [expensesByCategory]);

  const monthLoading = summaryQuery.isLoading || topQuery.isLoading;
  const monthError = summaryQuery.isError;

  return (
    <AppLayout>
      <PageHeader
        eyebrow={t("reports.eyebrow")}
        title={t("navigation.reports")}
        subtitle={t("reports.subtitle", { period: periodLabel })}
        action={
          <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto">
            <ReportFilters
              month={month}
              year={year}
              onMonthChange={(nextMonth) =>
                setPeriod((current) => ({ ...current, month: nextMonth }))
              }
              onYearChange={(nextYear) =>
                setPeriod((current) => ({ ...current, year: nextYear }))
              }
            />
            <ExportReportButton month={month} year={year} />
          </div>
        }
      />

      <div className="mt-6 space-y-6">
        {monthError && (
          <ErrorBanner
            error={summaryQuery.error}
            onRetry={() => {
              void summaryQuery.refetch();
              void topQuery.refetch();
            }}
          />
        )}

        {monthLoading && (
          <div aria-busy="true" aria-live="polite">
            <span className="sr-only">{t("common.loading")}</span>
            <ReportSkeleton />
          </div>
        )}

        {!monthLoading && !monthError && !hasMonthData && (
          <EmptyState
            icon={ChartPie}
            title={t("reports.emptyTitle")}
            description={t("reports.emptyDescription")}
          />
        )}

        {!monthLoading && !monthError && hasMonthData && (
          <>
            <section
              aria-label={t("reports.summarySection")}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <SummaryCard
                title={t("reports.totalExpense")}
                value={formatCurrency(totalExpense, i18n.language)}
                icon={TrendingDown}
                tone="danger"
              />
              <SummaryCard
                title={t("reports.categories")}
                value={`${expensesByCategory.length}`}
                icon={Folders}
                tone="primary"
              />
              <SummaryCard
                title={t("reports.highestCategory")}
                value={
                  highestCategory
                    ? getCategoryLabel(highestCategory.category, t)
                    : t("reports.noCategory")
                }
                icon={Trophy}
              />
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ExpenseByCategoryChart
                items={expensesByCategory}
                isLoading={false}
                isError={false}
                error={null}
                onRetry={() => void summaryQuery.refetch()}
              />
              <TopCategoriesList
                items={topQuery.data ?? []}
                isLoading={false}
                isError={topQuery.isError}
                error={topQuery.error}
                onRetry={() => void topQuery.refetch()}
              />
            </section>
          </>
        )}

        <MonthlyTrendChart
          points={trendQuery.data ?? []}
          isLoading={trendQuery.isLoading}
          error={trendQuery.error}
          isError={trendQuery.isError}
          onRetry={() => void trendQuery.refetch()}
        />
      </div>
    </AppLayout>
  );
}

export default ReportsPage;
