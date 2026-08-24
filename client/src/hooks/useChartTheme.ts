import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export type ChartTheme = {
  primary: string;
  success: string;
  danger: string;
  warning: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  border: string;
  surface: string;
  bgElevated: string;
};

const fallback: ChartTheme = {
  primary: "#3b82f6",
  success: "#22c55e",
  danger: "#ef4444",
  warning: "#f59e0b",
  fg: "#f8fafc",
  fgMuted: "#cbd5e1",
  fgSubtle: "#94a3b8",
  border: "#243044",
  surface: "#162032",
  bgElevated: "#101826",
};

function readVar(name: string, fallbackValue: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallbackValue;
}

function readChartTheme(): ChartTheme {
  return {
    primary: readVar("--app-primary", fallback.primary),
    success: readVar("--app-success", fallback.success),
    danger: readVar("--app-danger", fallback.danger),
    warning: readVar("--app-warning", fallback.warning),
    fg: readVar("--app-fg", fallback.fg),
    fgMuted: readVar("--app-fg-muted", fallback.fgMuted),
    fgSubtle: readVar("--app-fg-subtle", fallback.fgSubtle),
    border: readVar("--app-border", fallback.border),
    surface: readVar("--app-surface", fallback.surface),
    bgElevated: readVar("--app-bg-elevated", fallback.bgElevated),
  };
}

export function useChartTheme(): ChartTheme {
  const { theme } = useTheme();
  const [colors, setColors] = useState<ChartTheme>(readChartTheme);

  useEffect(() => {
    setColors(readChartTheme());
  }, [theme]);

  return colors;
}
