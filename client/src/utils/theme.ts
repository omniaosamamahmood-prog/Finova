export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return null;
}

export function resolveTheme(stored: Theme | null = getStoredTheme()): Theme {
  return stored ?? getSystemTheme();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function persistTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}
