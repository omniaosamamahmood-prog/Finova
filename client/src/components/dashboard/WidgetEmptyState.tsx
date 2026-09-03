import { Link } from "react-router-dom";

type WidgetEmptyStateProps = {
  title: string;
  description: string;
  actionTo?: string;
  actionLabel: string;
  onAction?: () => void;
};

function WidgetEmptyState({
  title,
  description,
  actionTo,
  actionLabel,
  onAction,
}: WidgetEmptyStateProps) {
  return (
    <div className="mt-5 text-start">
      <p className="text-sm font-semibold text-fg">{title}</p>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-fg-muted">
        {description}
      </p>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
        >
          {actionLabel}
        </button>
      ) : (
        <Link
          to={actionTo ?? "/"}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default WidgetEmptyState;
