import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      title={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-fg-muted transition hover:bg-surface-hover hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
      {showLabel && (
        <span>{isDark ? t("theme.light") : t("theme.dark")}</span>
      )}
    </button>
  );
}

export default ThemeToggle;
