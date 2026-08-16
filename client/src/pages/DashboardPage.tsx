import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/dashboard/Header";
import SummaryCard from "../components/dashboard/SummaryCard";
import { useDashboardStats } from "../hooks/useDashboard";
import { formatCurrency } from "../utils/format";
import { getErrorMessage } from "../utils/errorMessage";
import Button from "../components/ui/Button";

function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || "User";

  const stats = data ?? {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0,
  };

  return (
    <AppLayout>
      <Header userName={userName} />

      {isError && (
        <div className="mt-6 rounded-2xl border border-danger/30 bg-danger-muted p-4 text-start">
          <p className="text-sm text-danger">
            {t(getErrorMessage(error), {
              defaultValue: getErrorMessage(error),
            })}
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3 w-auto px-4"
            text={t("common.retry")}
            onClick={() => void refetch()}
          />
        </div>
      )}

      <section
        aria-label={t("dashboard.summarySection")}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))
        ) : (
          <>
            <SummaryCard
              title={t("dashboard.totalBalance")}
              value={formatCurrency(stats.totalBalance, i18n.language)}
            />
            <SummaryCard
              title={t("dashboard.income")}
              value={formatCurrency(stats.totalIncome, i18n.language)}
              valueClassName="text-success"
            />
            <SummaryCard
              title={t("dashboard.expenses")}
              value={formatCurrency(stats.totalExpense, i18n.language)}
              valueClassName="text-danger"
            />
            <SummaryCard
              title={t("dashboard.transactions")}
              value={`${stats.transactionCount}`}
              valueClassName="text-primary"
            />
          </>
        )}
      </section>

      <section
        aria-hidden="true"
        className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12"
      >
        <div className="flex flex-col gap-5 lg:col-span-8">
          {/* Spending Chart */}
          {/* Budget Progress */}
        </div>
        <div className="flex flex-col gap-5 lg:col-span-4">
          {/* Recent Transactions */}
          {/* Recent Activity */}
        </div>
      </section>
    </AppLayout>
  );
}

export default DashboardPage;
