import { useTranslation } from "react-i18next";
import FinovaLogo from "./FinovaLogo";

type BrandMarkProps = {
  compact?: boolean;
};

function BrandMark({ compact = false }: BrandMarkProps) {
  const { t } = useTranslation();

  return (
    <span className="inline-flex items-center" aria-label={t("common.appName")}>
      <FinovaLogo
        compact={compact}
        className={
          compact ? "h-8 w-8 shrink-0 sm:h-9 sm:w-9" : "h-7 w-auto sm:h-8"
        }
      />
    </span>
  );
}

export default BrandMark;
