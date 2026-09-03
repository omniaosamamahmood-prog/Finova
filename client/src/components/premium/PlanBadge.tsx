import { Crown, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UserPlan } from "../../types/api";

type PlanBadgeProps = {
  plan: UserPlan;
  className?: string;
};

function PlanBadge({ plan, className = "" }: PlanBadgeProps) {
  const { t } = useTranslation();
  const isPremium = plan === "PREMIUM";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${
        isPremium
          ? "bg-warning-muted text-warning"
          : "bg-surface text-fg-muted"
      } ${className}`}
    >
      {isPremium ? (
        <Crown className="size-3" aria-hidden />
      ) : (
        <Lock className="size-3" aria-hidden />
      )}
      {isPremium ? t("premium.badge") : t("premium.free")}
    </span>
  );
}

export default PlanBadge;
