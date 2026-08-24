import { Wallet, TrendingUp, TrendingDown, Receipt, Sparkles, Repeat } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/dashboard/Header";
import SummaryCard from "../components/dashboard/SummaryCard";
import BudgetProgressWidget from "../components/dashboard/BudgetProgressWidget";
import GoalProgressWidget from "../components/dashboard/GoalProgressWidget";
import FinancialInsights from "../components/dashboard/FinancialInsights";
import UpcomingRecurringWidget from "../components/dashboard/UpcomingRecurringWidget";
import GettingStartedCard from "../components/dashboard/GettingStartedCard";
import DashboardEmptyCard from "../components/dashboard/DashboardEmptyCard";
import ErrorBanner from "../components/ui/ErrorBanner";
import { useGettingStarted } from "../hooks/useGettingStarted";
import { useProfile } from "../hooks/useProfile";
import { formatCurrency } from "../utils/format";
import { getStoredUser } from "../utils/storedUser";

function DashboardPage() {
  const { t, i18n } = useTranslation();
  const {
    stats,
    isLoading,
    isError,
    error,
    refetch,
    hasTransactions,
    hasBudgets,
    hasGoals,
    showOnboarding,
  } = useGettingStarted();
  const { data: profile } = useProfile();

  const userName =
    profile?.fullName || getStoredUser().fullName || t("common.appName");

  return (
    <AppLayout>
      <Header userName={userName} />

      {isError && (
        <div className="mt-6">
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        </div>
      )}

      {showOnboarding && (
        <div className="mt-6">
          <GettingStartedCard
            hasTransactions={hasTransactions}
            hasBudgets={hasBudgets}
            hasGoals={hasGoals}
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
              icon={Wallet}
            />
            <SummaryCard
              title={t("dashboard.income")}
              value={formatCurrency(stats.totalIncome, i18n.language)}
              icon={TrendingUp}
              tone="success"
            />
            <SummaryCard
              title={t("dashboard.expenses")}
              value={formatCurrency(stats.totalExpense, i18n.language)}
              icon={TrendingDown}
              tone="danger"
            />
            <SummaryCard
              title={t("dashboard.transactions")}
              value={`${stats.transactionCount}`}
              icon={Receipt}
              tone="primary"
            />
          </>
        )}
      </section>

      {showOnboarding ? (
        <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-2">
          <DashboardEmptyCard
            heading={t("insights.sectionTitle")}
            headingIcon={Sparkles}
            title={t("dashboard.onboarding.noTransactionsTitle")}
            description={t("dashboard.onboarding.noTransactionsDescription")}
            actionTo="/transactions"
            actionLabel={t("dashboard.onboarding.addTransaction")}
          />
          <DashboardEmptyCard
            heading={t("dashboard.upcomingRecurring")}
            headingIcon={Repeat}
            title={t("dashboard.onboarding.recurringEmptyTitle")}
            description={t("dashboard.onboarding.recurringEmptyDescription")}
            actionTo="/recurring-transactions"
            actionLabel={t("dashboard.onboarding.addRecurring")}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 min-w-0">
            <FinancialInsights />
          </div>
          <div className="mt-8 min-w-0">
            <UpcomingRecurringWidget />
          </div>
        </>
      )}

      <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-8">
          <BudgetProgressWidget />
        </div>
        <div className="flex flex-col gap-5 lg:col-span-4">
          <GoalProgressWidget />
        </div>
      </section>
    </AppLayout>
  );
}

export default DashboardPage;
