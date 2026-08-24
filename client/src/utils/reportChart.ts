export const REPORT_CATEGORY_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#a78bfa",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#14b8a6",
] as const;

export function getCategoryColor(index: number): string {
  return REPORT_CATEGORY_COLORS[index % REPORT_CATEGORY_COLORS.length];
}
