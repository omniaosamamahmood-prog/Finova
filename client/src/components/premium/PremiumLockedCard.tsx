import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

type PremiumLockedCardProps = {
  heading: string;
  headingIcon: LucideIcon;
  description: string;
  onUnlock: () => void;
};

function PremiumLockedCard({
  heading,
  headingIcon: HeadingIcon,
  description,
  onUnlock,
}: PremiumLockedCardProps) {
  const { t } = useTranslation();

  return (
    <section className="ui-card h-full p-4 sm:p-6" aria-label={heading}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning-muted text-warning">
            <HeadingIcon className="size-4" aria-hidden />
          </span>
          <h3 className="truncate text-base font-semibold text-fg">{heading}</h3>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-warning-muted px-2 py-0.5 text-[11px] font-semibold tracking-wide text-warning uppercase">
          <Lock className="size-3" aria-hidden />
          {t("premium.badge")}
        </span>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-fg-muted">{description}</p>
      <Button
        type="button"
        className="mt-4 w-full sm:w-auto sm:px-5"
        onClick={onUnlock}
      >
        {t("premium.cta")}
      </Button>
    </section>
  );
}

export default PremiumLockedCard;
