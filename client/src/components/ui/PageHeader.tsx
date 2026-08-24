import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
};

function PageHeader({ title, subtitle, eyebrow, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 text-start">
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-fg-subtle uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-[1.75rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-[15px]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 sm:pb-0.5">{action}</div>}
    </div>
  );
}

export default PageHeader;
