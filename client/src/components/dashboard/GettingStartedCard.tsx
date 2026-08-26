import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, Plus, Sparkles, Target, Wallet } from "lucide-react";
import Button from "../ui/Button";

type GettingStartedCardProps = {
  hasTransactions: boolean;
  hasBudgets: boolean;
  hasGoals: boolean;
};

function GettingStartedCard({
  hasTransactions,
  hasBudgets,
  hasGoals,
}: GettingStartedCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    {
      key: "transaction",
      done: hasTransactions,
      label: t("dashboard.onboarding.stepTransaction"),
    },
    {
      key: "budget",
      done: hasBudgets,
      label: t("dashboard.onboarding.stepBudget"),
    },
    {
      key: "goal",
      done: hasGoals,
      label: t("dashboard.onboarding.stepGoal"),
    },
  ] as const;

  return (
    <section
      className="ui-card overflow-hidden p-4 sm:p-6 lg:p-8"
      aria-labelledby="getting-started-title"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-muted text-primary">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 text-start">
          <h3
            id="getting-started-title"
            className="text-lg font-semibold tracking-tight text-fg sm:text-xl"
          >
            {t("dashboard.onboarding.title")}
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-[15px]">
            {t("dashboard.onboarding.description")}
          </p>
        </div>
      </div>

      <ol
        className="mt-6 grid gap-2 sm:grid-cols-3"
        aria-label={t("dashboard.onboarding.checklistLabel")}
      >
        {steps.map((step, index) => (
          <li
            key={step.key}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-border-subtle bg-bg px-3.5 py-3 text-start"
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                step.done
                  ? "bg-success text-white"
                  : "border border-border bg-surface text-fg-muted"
              }`}
              aria-hidden
            >
              {step.done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
            </span>
            <span
              className={`min-w-0 text-sm font-medium ${
                step.done ? "text-fg-muted" : "text-fg"
              }`}
            >
              {step.label}
              <span className="sr-only">
                {step.done
                  ? t("dashboard.onboarding.stepDone")
                  : t("dashboard.onboarding.stepTodo")}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="w-full sm:w-auto sm:px-5"
          onClick={() => navigate("/transactions")}
        >
          <Plus className="size-4" aria-hidden />
          {t("dashboard.onboarding.addFirstTransaction")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto sm:px-5"
          onClick={() => navigate("/budgets")}
        >
          <Wallet className="size-4" aria-hidden />
          {t("dashboard.onboarding.createBudget")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto sm:px-5"
          onClick={() => navigate("/goals")}
        >
          <Target className="size-4" aria-hidden />
          {t("dashboard.onboarding.createGoal")}
        </Button>
      </div>
    </section>
  );
}

export default GettingStartedCard;
