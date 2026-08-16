export const LANGUAGE_STORAGE_KEY = "language";

export type AppLanguage = "en" | "ar";

export function getStoredLanguage(): AppLanguage | null {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "en" || stored === "ar") {
    return stored;
  }
  return null;
}

export function setHtmlLanguage(lng: AppLanguage): void {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
}

export function persistLanguage(lng: AppLanguage): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  setHtmlLanguage(lng);
}
