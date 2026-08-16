import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg outline-none transition focus:border-primary focus:shadow-[var(--app-ring-focus)] ${className}`}
    >
      {children}
    </select>
  );
}

export default Select;
