import { useTranslation } from "react-i18next";
import {
  persistLanguage,
  type AppLanguage,
} from "../utils/language";

type LanguageSwitcherProps = {
  className?: string;
};

function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  const setLang = (lng: AppLanguage) => {
    persistLanguage(lng);
    void i18n.changeLanguage(lng);
  };

  const isEn = i18n.language.startsWith("en");
  const isAr = i18n.language.startsWith("ar");

  return (
    <div
      className={`inline-flex rounded-xl border border-border bg-bg p-1 ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          isEn
            ? "bg-primary text-white shadow-sm"
            : "text-fg-muted hover:text-fg"
        }`}
      >
        {t("language.english")}
      </button>

      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          isAr
            ? "bg-primary text-white shadow-sm"
            : "text-fg-muted hover:text-fg"
        }`}
      >
        {t("language.arabic")}
      </button>
    </div>
  );
}

export default LanguageSwitcher;
