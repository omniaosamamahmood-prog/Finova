import { useState } from "react";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../ui/Button";
import { useToast } from "../ui/Toast";
import { queryKeys } from "../../lib/queryKeys";
import { fetchReportSummary, fetchMonthlyTrend, fetchTopCategories } from "../../services/report.service";
import { fetchBudgets } from "../../services/budget.service";
import { fetchGoals } from "../../services/goal.service";
import { fetchFinancialInsights } from "../../services/insight.service";
import { fetchTransactions } from "../../services/transaction.service";
import type {
  Budget,
  FinancialInsight,
  Goal,
  MonthlyTrendPoint,
  ReportSummary,
  TopSpendingCategory,
  Transaction,
} from "../../types/api";
import { getCategoryLabel } from "../../utils/categoryLabel";
import {
  formatCurrency,
  formatGeneratedDate,
  formatPercent,
  getMonthLabel,
} from "../../utils/format";
import { getGoalRemaining } from "../../utils/goalProgress";
import {
  resolveInsightMessage,
  resolveInsightTitle,
} from "../../utils/insightText";
import type { FinancialReportData } from "../../utils/exportFinancialReport";

type ExportReportButtonProps = {
  month: number;
  year: number;
};

function getUserName(fallback: string): string {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}") as {
      fullName?: string;
    };
    return user.fullName?.trim() || fallback;
  } catch {
    return fallback;
  }
}

function isInSelectedMonth(value: string, month: number, year: number): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === year && date.getMonth() + 1 === month;
}

function ExportReportButton({ month, year }: ExportReportButtonProps) {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [exporting, setExporting] = useState(false);
  const locale = i18n.language;
  // Match LanguageSwitcher / HTML dir — never miss Arabic UI as LTR PDF.
  const rtl =
    locale.toLowerCase().startsWith("ar") ||
    document.documentElement.dir === "rtl";

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);

    try {
      const [
        summary,
        trend,
        topCategories,
        budgets,
        goals,
        insights,
        transactions,
      ] = await Promise.all([
        queryClient.ensureQueryData<ReportSummary>({
          queryKey: queryKeys.reportSummary(month, year),
          queryFn: () => fetchReportSummary(month, year),
        }),
        queryClient.ensureQueryData<MonthlyTrendPoint[]>({
          queryKey: queryKeys.reportMonthlyTrend(year),
          queryFn: () => fetchMonthlyTrend(year),
        }),
        queryClient.ensureQueryData<TopSpendingCategory[]>({
          queryKey: queryKeys.reportTopCategories(month, year),
          queryFn: () => fetchTopCategories(month, year),
        }),
        queryClient.ensureQueryData<Budget[]>({
          queryKey: queryKeys.budgets,
          queryFn: fetchBudgets,
        }),
        queryClient.ensureQueryData<Goal[]>({
          queryKey: queryKeys.goals,
          queryFn: fetchGoals,
        }),
        queryClient.ensureQueryData<FinancialInsight[]>({
          queryKey: queryKeys.insights,
          queryFn: fetchFinancialInsights,
        }),
        queryClient.ensureQueryData<Transaction[]>({
          queryKey: queryKeys.transactions,
          queryFn: fetchTransactions,
        }),
      ]);

      const monthTrend = trend.find((point) => point.month === month);
      const totalIncome = monthTrend?.income ?? 0;
      const totalExpense = summary.totalExpense;
      const money = (value: number) =>
        // Keep PDF amounts in Latin digits so mixed Arabic currency labels
        // reshape cleanly; section titles stay fully Arabic.
        formatCurrency(value, rtl ? "en-EG" : locale);
      const percent = (value: number) =>
        formatPercent(value, rtl ? "en" : locale);
      const periodLabel = t("reports.period", {
        month: getMonthLabel(month, locale, "long"),
        year,
      });

      const payload: FinancialReportData = {
        userName: getUserName(t("common.appName")),
        month,
        year,
        periodLabel,
        rtl,
        labels: {
          appName: t("common.appName"),
          reportTitle: t("reports.export.reportTitle"),
          generatedOn: t("reports.export.generatedOn", {
            date: formatGeneratedDate(new Date(), locale),
          }),
          summaryTitle: t("reports.export.summaryTitle"),
          income: t("reports.export.income"),
          expense: t("reports.export.expense"),
          balance: t("reports.export.balance"),
          transactions: t("reports.export.transactions"),
          spendingTitle: t("reports.expenseByCategory"),
          topTitle: t("reports.topCategories"),
          budgetsTitle: t("reports.export.budgetsTitle"),
          goalsTitle: t("reports.export.goalsTitle"),
          insightsTitle: t("insights.sectionTitle"),
          emptySection: t("reports.export.emptySection"),
          category: t("reports.export.category"),
          amount: t("reports.amount"),
          percentage: t("reports.percentage"),
          budget: t("budgets.labels.budget"),
          spent: t("budgets.labels.spent"),
          remaining: t("budgets.labels.remaining"),
          progress: t("budgets.labels.progress"),
          status: t("reports.export.status"),
          exceeded: t("budgets.exceeded"),
          onTrack: t("reports.export.onTrack"),
          goalName: t("goals.form.name"),
          target: t("goals.labels.target"),
          saved: t("goals.labels.saved"),
          footer: t("reports.export.footer"),
          pageLabel: t("reports.export.page"),
        },
        summary: {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          transactionCount: transactions.filter((transaction) =>
            isInSelectedMonth(transaction.transactionDate, month, year)
          ).length,
        },
        categories: [...(summary.expensesByCategory ?? [])]
          .sort((a, b) => b.amount - a.amount)
          .map((item) => ({
            name: getCategoryLabel(item.category, t),
            amount: money(item.amount),
            percentage: percent(item.percentage),
          })),
        topCategories: (topCategories ?? []).map((item) => ({
          name: getCategoryLabel(item.category, t),
          amount: money(item.amount),
          percentage: "",
        })),
        budgets: budgets.map((budget) => ({
          category: budget.category?.name
            ? getCategoryLabel(budget.category.name, t)
            : t("transactions.uncategorized"),
          amount: money(budget.amount),
          spent: money(budget.spent),
          remaining: money(budget.remaining),
          progress: percent(budget.progress),
          exceeded: budget.progress >= 100,
        })),
        goals: goals.map((goal) => ({
          name: goal.name,
          targetAmount: money(goal.targetAmount),
          currentAmount: money(goal.currentAmount),
          remaining: money(
            Math.max(getGoalRemaining(goal.targetAmount, goal.currentAmount), 0)
          ),
          progress: percent(goal.progress),
        })),
        insights: insights.map((insight) => ({
          title: resolveInsightTitle(insight, t),
          message: resolveInsightMessage(insight, t, locale),
        })),
      };

      const { exportFinancialReport } = await import(
        "../../utils/exportFinancialReport"
      );
      await exportFinancialReport(payload, money);
      showToast(t("reports.export.success"), "success");
    } catch (error) {
      const isArabicFont =
        error instanceof Error && error.message === "ARABIC_FONT_UNAVAILABLE";
      showToast(
        t(isArabicFont ? "reports.export.arabicFontError" : "reports.export.error"),
        "error"
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full sm:w-auto sm:px-5"
      isLoading={exporting}
      onClick={() => void handleExport()}
    >
      {!exporting && <Download className="size-4" aria-hidden />}
      {exporting ? t("reports.export.generating") : t("reports.export.download")}
    </Button>
  );
}

export default ExportReportButton;
