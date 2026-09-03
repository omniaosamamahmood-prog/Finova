import { Crown, Repeat, Sparkles, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import type { PremiumFeature } from "../../utils/plan";

type UpgradeToPremiumPanelProps = {
  feature?: PremiumFeature | null;
  isUpgrading?: boolean;
  showTitle?: boolean;
  onUpgrade: () => void;
  onCancel?: () => void;
};

function UpgradeToPremiumPanel({
  feature,
  isUpgrading = false,
  showTitle = true,
  onUpgrade,
  onCancel,
}: UpgradeToPremiumPanelProps) {
  const { t } = useTranslation();

  const title =
    feature === "goals"
      ? t("premium.page.goalsTitle")
      : feature === "recurring"
        ? t("premium.page.recurringTitle")
        : t("premium.upgradeTitle");

  return (
    <div className="text-start">
      <span className="grid size-12 place-items-center rounded-2xl bg-warning-muted text-warning">
        <Crown className="size-6" aria-hidden />
      </span>

      {showTitle && (
        <>
          <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-warning uppercase">
            {t("premium.badge")}
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-fg sm:text-2xl">
            {title}
          </h2>
        </>
      )}
      <p
        className={`${showTitle ? "mt-2" : "mt-4"} max-w-md text-sm leading-relaxed text-fg-muted`}
      >
        {t("premium.upgradeSubtitle")}
      </p>

      <ul className="mt-6 grid gap-3">
        <li className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-bg px-4 py-3.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-success-muted text-success">
            <Target className="size-4" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-fg">
              {t("premium.features.goals.title")}
            </span>
            <span className="mt-0.5 block text-sm leading-relaxed text-fg-muted">
              {t("premium.features.goals.description")}
            </span>
          </span>
        </li>
        <li className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-bg px-4 py-3.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-muted text-primary">
            <Repeat className="size-4" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-fg">
              {t("premium.features.recurring.title")}
            </span>
            <span className="mt-0.5 block text-sm leading-relaxed text-fg-muted">
              {t("premium.features.recurring.description")}
            </span>
          </span>
        </li>
      </ul>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="w-full sm:w-auto sm:px-5"
          isLoading={isUpgrading}
          onClick={onUpgrade}
        >
          <Sparkles className="size-4" aria-hidden />
          {t("premium.cta")}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto sm:px-5"
            disabled={isUpgrading}
            onClick={onCancel}
          >
            {t("premium.later")}
          </Button>
        )}
      </div>
    </div>
  );
}

export default UpgradeToPremiumPanel;
