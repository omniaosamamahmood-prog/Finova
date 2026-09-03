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
import { usePlan } from "../contexts/PlanContext";
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
  const { isPremium, openUpgradeModal } = usePlan();

  const userName =
    profile?.fullName || getStoredUser().fullName || t("common.appName");

  return (
    <AppLayout>
      <Header userName={userName} />

      <div className="flex flex-col">
        {isError && (
          <div className="order-1 mt-4 md:mt-6">
            <ErrorBanner error={error} onRetry={() => void refetch()} />
          </div>
        )}

        {showOnboarding && (
          <div className="order-3 mt-4 md:order-2 md:mt-6">
            <GettingStartedCard
              hasTransactions={hasTransactions}
              hasBudgets={hasBudgets}
              hasGoals={hasGoals}
            />
          </div>
        )}

        <section
          aria-label={t("dashboard.summarySection")}
          className="order-2 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:order-3 md:mt-6 xl:grid-cols-4"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl border border-border bg-surface md:h-28"
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
          <div className="order-4 mt-5 grid min-w-0 gap-4 md:mt-8 md:gap-5 lg:grid-cols-2">
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
              actionTo={isPremium ? "/recurring-transactions" : undefined}
              actionLabel={
                isPremium
                  ? t("dashboard.onboarding.addRecurring")
                  : t("premium.cta")
              }
              onAction={
                isPremium ? undefined : () => openUpgradeModal("recurring")
              }
            />
          </div>
        ) : (
          <>
            <div className="order-4 min-w-0 empty:hidden [&:not(:empty)]:mt-5 md:[&:not(:empty)]:mt-8">
              <FinancialInsights />
            </div>
            <div className="order-5 mt-5 min-w-0 md:mt-8">
              <UpcomingRecurringWidget />
            </div>
          </>
        )}

        <section className="order-6 mt-5 grid grid-cols-1 gap-4 md:mt-8 md:gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-4 md:gap-5 lg:col-span-8">
            <BudgetProgressWidget />
          </div>
          <div className="flex flex-col gap-4 md:gap-5 lg:col-span-4">
            <GoalProgressWidget />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default DashboardPage;
