import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";

function PreferencesSection() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-w-0 flex-1 flex-col justify-center rounded-2xl border border-border-subtle bg-bg p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 text-start">
            <p className="text-sm font-medium text-fg">
              {t("settings.preferences.language")}
            </p>
            <p className="mt-1 text-sm text-fg-subtle">
              {t("settings.preferences.languageHint")}
            </p>
          </div>
          <LanguageSwitcher className="w-full shrink-0 sm:w-auto sm:min-w-56" />
        </div>
      </div>
    </div>
  );
}

export default PreferencesSection;
