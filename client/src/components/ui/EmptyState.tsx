import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="ui-card px-6 py-16 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-muted text-primary">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="mt-5 text-lg font-semibold text-fg">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export default EmptyState;
