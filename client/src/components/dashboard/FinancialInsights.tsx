import { useEffect, useState } from "react";
import {
  TriangleAlert,
  CircleX,
  Lightbulb,
  PiggyBank,
  Sparkles,
  Target,
  ChartPie,
  Trophy,
  TrendingDown,
  Repeat,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorBanner from "../ui/ErrorBanner";
import { useFinancialInsights } from "../../hooks/useFinancialInsights";
import {
  resolveInsightMessage,
  resolveInsightTitle,
} from "../../utils/insightText";
import {
  dismissInsight,
  getInsightId,
  readDismissedInsightIds,
} from "../../utils/insightDismiss";
import { getStoredUser } from "../../utils/storedUser";
import type { FinancialInsight, InsightType } from "../../types/api";

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  "pie-chart": ChartPie,
  "alert-triangle": TriangleAlert,
  "x-circle": CircleX,
  trophy: Trophy,
  target: Target,
  "piggy-bank": PiggyBank,
  "trending-down": TrendingDown,
  repeat: Repeat,
};

const typeStyles: Record<
  InsightType,
  { border: string; icon: string; title: string }
> = {
  success: {
    border: "border-s-success",
    icon: "bg-success-muted text-success",
    title: "text-success",
  },
  warning: {
    border: "border-s-warning",
    icon: "bg-warning-muted text-warning",
    title: "text-warning",
  },
  danger: {
    border: "border-s-danger",
    icon: "bg-danger-muted text-danger",
    title: "text-danger",
  },
  info: {
    border: "border-s-primary",
    icon: "bg-primary-muted text-primary",
    title: "text-primary",
  },
};

function useIsMobileLayout() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function InsightSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-2xl border border-border bg-surface"
        />
      ))}
    </div>
  );
}

function FinancialInsights() {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobileLayout();
  const { data: insights = [], isLoading, isError, error, refetch } =
    useFinancialInsights();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() =>
    readDismissedInsightIds(getStoredUser().id)
  );

  const visibleInsights: FinancialInsight[] = isMobile
    ? insights.filter((insight) => !dismissedIds.has(getInsightId(insight)))
    : insights;

  const handleDismiss = (insight: FinancialInsight) => {
    const userId = getStoredUser().id;
    const id = getInsightId(insight);
    dismissInsight(userId, id);
    setDismissedIds(readDismissedInsightIds(userId));
  };

  if (isMobile && !isLoading && !isError && visibleInsights.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t("insights.sectionLabel")}
      className="ui-card min-w-0 overflow-hidden p-4 sm:p-6"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-muted text-primary">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <h3 className="text-base font-semibold text-fg">
          {t("insights.sectionTitle")}
        </h3>
      </div>

      <div className="mt-4 md:mt-5">
        {isLoading && (
          <div aria-busy="true" aria-live="polite">
            <span className="sr-only">{t("common.loading")}</span>
            <InsightSkeleton />
          </div>
        )}

        {isError && (
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && visibleInsights.length === 0 && (
          <p className="text-sm leading-relaxed text-fg-muted">
            {t("insights.empty")}
          </p>
        )}

        {!isLoading && !isError && visibleInsights.length > 0 && (
          <ul className="grid min-w-0 gap-2.5 md:gap-3 sm:grid-cols-2">
            {visibleInsights.map((insight, index) => {
              const styles = typeStyles[insight.type] ?? typeStyles.info;
              const Icon = iconMap[insight.icon] ?? Lightbulb;
              const insightId = getInsightId(insight);

              return (
                <li
                  key={`${insightId}-${index}`}
                  className={`relative flex min-w-0 items-start gap-3 rounded-2xl border border-border border-s-4 bg-bg p-3.5 text-start md:p-4 ${styles.border}`}
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-xl md:size-10 ${styles.icon}`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 pe-6 md:pe-0">
                    <p className={`text-sm font-semibold ${styles.title}`}>
                      {resolveInsightTitle(insight, t)}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed break-words text-fg-muted">
                      {resolveInsightMessage(insight, t, i18n.language)}
                    </p>
                  </div>
                  {isMobile && (
                    <button
                      type="button"
                      onClick={() => handleDismiss(insight)}
                      className="absolute end-2 top-2 rounded-lg p-1.5 text-fg-subtle transition hover:bg-surface hover:text-fg"
                      aria-label={t("insights.dismiss")}
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default FinancialInsights;
