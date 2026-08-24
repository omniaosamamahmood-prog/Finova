import { Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Goal } from "../../types/api";
import { formatCurrency, formatDate } from "../../utils/format";
import {
  getGoalBarWidth,
  getGoalProgressTone,
  getGoalRemaining,
  isGoalOverdue,
} from "../../utils/goalProgress";
import CardActions from "../ui/CardActions";

type GoalCardProps = {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
};

function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const { t, i18n } = useTranslation();
  const tone = getGoalProgressTone(goal.progress);
  const barWidth = getGoalBarWidth(goal.progress);
  const remaining = getGoalRemaining(goal.targetAmount, goal.currentAmount);
  const overdue = isGoalOverdue(goal.targetDate, goal.progress);

  const barClass =
    tone === "done"
      ? "bg-success"
      : tone === "warn"
        ? "bg-warning"
        : "bg-primary";

  return (
    <article className="ui-card ui-card-hover p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
              tone === "done"
                ? "bg-success-muted text-success"
                : overdue
                  ? "bg-danger-muted text-danger"
                  : "bg-primary-muted text-primary"
            }`}
          >
            <Target className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 text-start">
            <h3 className="truncate text-base font-semibold text-fg">
              {goal.name}
            </h3>
            {tone === "done" && (
              <p className="mt-1 text-sm font-medium text-success">
                {t("goals.completed")}
              </p>
            )}
            {overdue && (
              <p className="mt-1 text-sm font-medium text-danger">
                {t("goals.overdue")}
              </p>
            )}
          </div>
        </div>

        <p
          className={`shrink-0 rounded-full px-2.5 py-1 text-sm font-semibold tabular-nums ${
            tone === "done"
              ? "bg-success-muted text-success"
              : "bg-surface-hover text-fg"
          }`}
        >
          {goal.progress.toFixed(goal.progress % 1 === 0 ? 0 : 1)}%
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">{t("goals.labels.target")}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-fg">
            {formatCurrency(goal.targetAmount, i18n.language)}
          </dd>
        </div>
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">{t("goals.labels.saved")}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-fg">
            {formatCurrency(goal.currentAmount, i18n.language)}
          </dd>
        </div>
        <div className="rounded-xl bg-bg px-3 py-2.5 text-start">
          <dt className="text-xs text-fg-subtle">{t("goals.labels.remaining")}</dt>
          <dd
            className={`mt-0.5 font-semibold tabular-nums ${
              remaining <= 0 ? "text-success" : "text-fg"
            }`}
          >
            {formatCurrency(Math.max(remaining, 0), i18n.language)}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-start text-sm text-fg-muted">
        <span className="text-fg-subtle">{t("goals.labels.targetDate")}: </span>
        {goal.targetDate
          ? formatDate(goal.targetDate, i18n.language)
          : t("goals.labels.noDate")}
      </p>

      <div className="mt-4">
        <div
          className="h-2 overflow-hidden rounded-full bg-surface-hover"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(barWidth)}
          aria-label={t("goals.labels.progress")}
        >
          <div
            className={`h-full rounded-full transition-[width] ${barClass}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      <CardActions onEdit={() => onEdit(goal)} onDelete={() => onDelete(goal)} />
    </article>
  );
}

export default GoalCard;
