type SummaryCardProps = {
  title: string;
  value: string;
  valueClassName?: string;
};

function SummaryCard({
  title,
  value,
  valueClassName = "text-fg",
}: SummaryCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <p className="text-start text-sm font-medium text-fg-muted">{title}</p>

      <h3
        className={`mt-3 text-start text-2xl font-bold tracking-tight tabular-nums ${valueClassName}`}
      >
        {value}
      </h3>
    </article>
  );
}

export default SummaryCard;
