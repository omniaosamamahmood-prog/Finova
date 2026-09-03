import { Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import PlanBadge from "../premium/PlanBadge";
import type { UserPlan } from "../../types/api";

type PlanSectionProps = {
  plan: UserPlan;
  isUpgrading: boolean;
  onUpgrade: () => void;
};

function PlanSection({ plan, isUpgrading, onUpgrade }: PlanSectionProps) {
  const { t } = useTranslation();
  const isPremium = plan === "PREMIUM";

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-warning-muted text-warning">
          <Crown className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 text-start">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-fg-muted">
              {t("premium.settings.current")}
            </p>
            <PlanBadge plan={plan} />
          </div>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-fg-muted">
            {isPremium
              ? t("premium.settings.premiumDescription")
              : t("premium.settings.freeDescription")}
          </p>
        </div>
      </div>
      {!isPremium && (
        <Button
          type="button"
          className="w-full shrink-0 sm:w-auto sm:px-5"
          isLoading={isUpgrading}
          onClick={onUpgrade}
        >
          {t("premium.settings.upgrade")}
        </Button>
      )}
    </div>
  );
}

export default PlanSection;
