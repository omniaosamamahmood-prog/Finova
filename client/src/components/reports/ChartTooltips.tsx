import { useTranslation } from "react-i18next";
import type { TooltipContentProps } from "recharts";
import { formatCurrency, formatPercent } from "../../utils/format";

type PieTooltipData = {
  name: string;
  amount: number;
  percentage: number;
};

export function ExpenseCategoryTooltip({
  active,
  payload,
}: TooltipContentProps) {
  const { t, i18n } = useTranslation();

  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload as PieTooltipData | undefined;
  if (!item) return null;

  return (
    <div className="rounded-xl border border-border bg-bg-elevated px-3 py-2.5 text-start shadow-card">
      <p className="text-sm font-semibold text-fg">{item.name}</p>
      <p className="mt-1 text-xs text-fg-muted">
        {t("reports.amount")}: {formatCurrency(item.amount, i18n.language)}
      </p>
      <p className="text-xs text-fg-muted">
        {t("reports.percentage")}: {formatPercent(item.percentage, i18n.language)}
      </p>
    </div>
  );
}

export function TrendTooltip({
  active,
  payload,
  label,
}: TooltipContentProps) {
  const { i18n } = useTranslation();

  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-bg-elevated px-3 py-2.5 text-start shadow-card">
      {label != null && (
        <p className="mb-1.5 text-sm font-semibold text-fg">{String(label)}</p>
      )}
      {payload.map((entry) => (
        <p key={String(entry.dataKey)} className="text-xs text-fg-muted">
          <span style={{ color: entry.color }}>{entry.name}</span>
          {": "}
          {formatCurrency(Number(entry.value ?? 0), i18n.language)}
        </p>
      ))}
    </div>
  );
}
