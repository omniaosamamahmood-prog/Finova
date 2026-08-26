import { useTranslation } from "react-i18next";
import { formatLongDate } from "../../utils/format";

type HeaderProps = {
  userName: string;
};

function Header({ userName }: HeaderProps) {
  const { t, i18n } = useTranslation();

  return (
    <header className="text-start">
      <p className="text-xs font-medium text-fg-subtle sm:text-sm">
        {formatLongDate(new Date(), i18n.language)}
      </p>
      <h2 className="mt-0.5 text-xl font-bold tracking-tight text-fg sm:mt-1 sm:text-3xl">
        {t("dashboard.welcome", { name: userName })}
      </h2>
      <p className="mt-1 hidden text-sm text-fg-muted md:mt-1.5 md:block md:text-base">
        {t("dashboard.overview")}
      </p>
    </header>
  );
}

export default Header;
