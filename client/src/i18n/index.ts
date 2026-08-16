import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import {
  getStoredLanguage,
  LANGUAGE_STORAGE_KEY,
} from "../utils/language";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Prefer explicit app key; fall back to legacy i18nextLng once.
const legacy = localStorage.getItem("i18nextLng");
const stored = getStoredLanguage();
const initialLng =
  stored ??
  (legacy === "en" || legacy === "ar" ? legacy : null) ??
  "en";

if (!stored && (legacy === "en" || legacy === "ar")) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, legacy);
}

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

document.documentElement.lang = i18n.language || "en";
document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";

export default i18n;
