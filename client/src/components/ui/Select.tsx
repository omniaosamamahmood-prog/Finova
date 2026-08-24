import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none transition hover:border-primary/30 focus:border-primary focus:bg-surface focus:shadow-[var(--app-ring-focus)] ${className}`}
    >
      {children}
    </select>
  );
}

export default Select;
