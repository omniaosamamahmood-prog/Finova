import type { TFunction } from "i18next";
import type { FinancialInsight } from "../types/api";
import { getCategoryLabel } from "./categoryLabel";
import { formatCurrency } from "./format";

export function resolveInsightTitle(
  insight: FinancialInsight,
  t: TFunction
): string {
  return t(insight.title, { defaultValue: insight.title });
}

export function resolveInsightMessage(
  insight: FinancialInsight,
  t: TFunction,
  locale: string
): string {
  const params = insight.params ?? {};
  const category =
    typeof params.category === "string"
      ? getCategoryLabel(params.category, t)
      : undefined;
  const amount =
    typeof params.amount === "number"
      ? formatCurrency(params.amount, locale)
      : params.amount;

  return t(insight.message, {
    defaultValue: insight.message,
    ...params,
    ...(category ? { category } : {}),
    ...(amount !== undefined ? { amount } : {}),
  });
}
