import { useTranslation } from "react-i18next";
import {
  persistLanguage,
  type AppLanguage,
} from "../utils/language";

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const setLang = (lng: AppLanguage) => {
    persistLanguage(lng);
    void i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          i18n.language === "en"
            ? "bg-primary text-fg"
            : "bg-transparent text-fg-muted hover:bg-surface-hover hover:text-fg"
        }`}
      >
        {t("language.english")}
      </button>

      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          i18n.language === "ar"
            ? "bg-primary text-fg"
            : "bg-transparent text-fg-muted hover:bg-surface-hover hover:text-fg"
        }`}
      >
        {t("language.arabic")}
      </button>
    </div>
  );
}

export default LanguageSwitcher;
