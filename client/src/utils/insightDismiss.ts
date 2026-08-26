import type { FinancialInsight } from "../types/api";

const storageKey = (userId: string) => `finova.insights.dismissed.${userId}`;

export function getInsightId(insight: FinancialInsight): string {
  const params = insight.params
    ? Object.entries(insight.params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    : "";
  return `${insight.type}|${insight.title}|${insight.icon}|${params}`;
}

export function readDismissedInsightIds(userId: string): Set<string> {
  if (!userId) return new Set();
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter((value): value is string => typeof value === "string")
    );
  } catch {
    return new Set();
  }
}

export function dismissInsight(userId: string, insightId: string) {
  if (!userId || !insightId) return;
  const next = readDismissedInsightIds(userId);
  next.add(insightId);
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify([...next]));
  } catch {
    // Ignore quota / private-mode failures.
  }
}
