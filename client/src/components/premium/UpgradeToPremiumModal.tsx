import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import UpgradeToPremiumPanel from "./UpgradeToPremiumPanel";
import type { PremiumFeature } from "../../utils/plan";

type UpgradeToPremiumModalProps = {
  open: boolean;
  feature?: PremiumFeature | null;
  isUpgrading?: boolean;
  onClose: () => void;
  onUpgrade: () => void;
};

function UpgradeToPremiumModal({
  open,
  feature,
  isUpgrading = false,
  onClose,
  onUpgrade,
}: UpgradeToPremiumModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isUpgrading) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, isUpgrading, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={() => {
          if (!isUpgrading) onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-premium-title"
        className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-border bg-bg-elevated shadow-card sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="upgrade-premium-title"
            className="text-lg font-semibold text-fg"
          >
            {t("premium.upgradeTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpgrading}
            className="rounded-lg p-2 text-fg-muted transition hover:bg-surface hover:text-fg disabled:opacity-50"
          >
            <X className="size-5" aria-hidden />
            <span className="sr-only">{t("common.close")}</span>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <UpgradeToPremiumPanel
            feature={feature}
            isUpgrading={isUpgrading}
            showTitle={false}
            onUpgrade={onUpgrade}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default UpgradeToPremiumModal;
