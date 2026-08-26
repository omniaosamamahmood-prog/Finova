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
    <article className="ui-card ui-card-hover flex h-full items-start gap-3 p-4 sm:gap-4 sm:p-6">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl sm:size-11 sm:rounded-2xl ${classes.icon}`}
      >
        <Icon className="size-4 sm:size-5" aria-hidden />
      </span>
      <div className="min-w-0 text-start">
        <p className="text-xs font-medium text-fg-muted sm:text-sm">{title}</p>
        <h3
          className={`mt-1 truncate text-xl font-bold tracking-tight tabular-nums sm:mt-1.5 sm:text-2xl ${classes.value}`}
        >
          {value}
        </h3>
      </div>
    </article>
  );
}

export default SummaryCard;
