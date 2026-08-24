import type { LucideIcon } from "lucide-react";
import WidgetEmptyState from "./WidgetEmptyState";

type DashboardEmptyCardProps = {
  heading: string;
  headingIcon: LucideIcon;
  title: string;
  description: string;
  actionTo: string;
  actionLabel: string;
};

function DashboardEmptyCard({
  heading,
  headingIcon: HeadingIcon,
  title,
  description,
  actionTo,
  actionLabel,
}: DashboardEmptyCardProps) {
  return (
    <section className="ui-card min-w-0 p-5 sm:p-6" aria-label={heading}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-muted text-primary">
          <HeadingIcon className="size-4" aria-hidden />
        </span>
        <h3 className="truncate text-base font-semibold text-fg">{heading}</h3>
      </div>
      <WidgetEmptyState
        title={title}
        description={description}
        actionTo={actionTo}
        actionLabel={actionLabel}
      />
    </section>
  );
}

export default DashboardEmptyCard;
