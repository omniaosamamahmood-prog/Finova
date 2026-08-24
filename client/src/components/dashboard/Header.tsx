import { useTranslation } from "react-i18next";
import { formatLongDate } from "../../utils/format";

type HeaderProps = {
  userName: string;
};

function Header({ userName }: HeaderProps) {
  const { t, i18n } = useTranslation();

  return (
    <header className="text-start">
      <p className="text-sm font-medium text-fg-subtle">
        {formatLongDate(new Date(), i18n.language)}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        {t("dashboard.welcome", { name: userName })}
      </h2>
      <p className="mt-1.5 text-sm text-fg-muted sm:text-base">
        {t("dashboard.overview")}
      </p>
    </header>
  );
}

export default Header;
