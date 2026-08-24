import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ReportSectionProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
};

function ReportSection({ title, icon: Icon, children }: ReportSectionProps) {
  return (
    <section className="ui-card flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-primary-muted text-primary">
          <Icon className="size-4" aria-hidden />
        </span>
        <h3 className="text-base font-semibold text-fg">{title}</h3>
      </div>
      <div className="mt-5 min-w-0 flex-1">{children}</div>
    </section>
  );
}

export default ReportSection;
