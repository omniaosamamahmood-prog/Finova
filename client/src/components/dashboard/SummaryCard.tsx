import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "danger" | "primary";
};

const toneClasses = {
  default: {
    icon: "bg-primary-muted text-primary",
    value: "text-fg",
  },
  success: {
    icon: "bg-success-muted text-success",
    value: "text-success",
  },
  danger: {
    icon: "bg-danger-muted text-danger",
    value: "text-danger",
  },
  primary: {
    icon: "bg-primary-muted text-primary",
    value: "text-primary",
  },
};

function SummaryCard({
  title,
  value,
  icon: Icon,
  tone = "default",
}: SummaryCardProps) {
  const classes = toneClasses[tone];

  return (
    <article className="ui-card ui-card-hover flex h-full items-start gap-4 p-5 sm:p-6">
      <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${classes.icon}`}>
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 text-start">
        <p className="text-sm font-medium text-fg-muted">{title}</p>
        <h3
          className={`mt-1.5 truncate text-2xl font-bold tracking-tight tabular-nums ${classes.value}`}
        >
          {value}
        </h3>
      </div>
    </article>
  );
}

export default SummaryCard;
