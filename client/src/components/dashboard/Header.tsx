import { useTranslation } from "react-i18next";

type HeaderProps = {
  userName: string;
};

function Header({ userName }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="text-start">
      <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        {t("navigation.dashboard")}
      </h2>

      <p className="mt-2 text-sm text-fg-muted sm:text-base">
        {t("dashboard.greeting")}
      </p>

      <p className="mt-0.5 text-base font-semibold text-fg sm:text-lg">
        {userName}
      </p>
    </header>
  );
}

export default Header;
