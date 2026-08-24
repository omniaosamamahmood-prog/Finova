import type { ButtonHTMLAttributes, ReactNode } from "react";

type FilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

function FilterChip({
  active = false,
  className = "",
  children,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        active
          ? "bg-primary text-white shadow-sm shadow-primary/25"
          : "border border-border bg-surface text-fg-muted hover:bg-surface-hover hover:text-fg"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default FilterChip;
