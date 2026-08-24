import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Target } from "lucide-react";
import { useGoals } from "../../hooks/useGoals";
import {
  getGoalBarWidth,
  getGoalProgressTone,
} from "../../utils/goalProgress";
import WidgetEmptyState from "./WidgetEmptyState";

function GoalProgressWidget() {
  const { t } = useTranslation();
  const { data: goals = [], isLoading, isError } = useGoals();

  const topGoals = [...goals]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  return (
    <section className="ui-card h-full p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-success-muted text-success">
            <Target className="size-4" aria-hidden />
          </span>
          <h3 className="text-base font-semibold text-fg">
            {t("dashboard.goalProgress")}
          </h3>
        </div>
        <Link
          to="/goals"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("dashboard.viewAll")}
        </Link>
      </div>

      {isLoading && (
        <div className="mt-5 space-y-4" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse space-y-2">
              <div className="h-3 w-24 rounded bg-surface-hover" />
              <div className="h-2 rounded-full bg-surface-hover" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-5 text-sm text-danger">{t("errors.somethingWrong")}</p>
      )}

      {!isLoading && !isError && topGoals.length === 0 && (
        <WidgetEmptyState
          title={t("dashboard.onboarding.goalEmptyTitle")}
          description={t("dashboard.onboarding.goalEmptyDescription")}
          actionTo="/goals"
          actionLabel={t("dashboard.onboarding.createGoal")}
        />
      )}

      {!isLoading && !isError && topGoals.length > 0 && (
        <ul className="mt-5 space-y-5">
          {topGoals.map((goal) => {
            const tone = getGoalProgressTone(goal.progress);
            const barWidth = getGoalBarWidth(goal.progress);
            const barClass =
              tone === "done"
                ? "bg-success"
                : tone === "warn"
                  ? "bg-warning"
                  : "bg-primary";

            return (
              <li key={goal.id}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-fg">
                    {goal.name}
                  </span>
                  <span
                    className={`shrink-0 font-semibold tabular-nums ${
                      tone === "done" ? "text-success" : "text-fg-muted"
                    }`}
                  >
                    {goal.progress.toFixed(goal.progress % 1 === 0 ? 0 : 1)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
                  <div
                    className={`h-full rounded-full ${barClass}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default GoalProgressWidget;
