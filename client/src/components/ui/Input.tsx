import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({ className = "", readOnly, disabled, ...props }: InputProps) {
  return (
    <input
      {...props}
      readOnly={readOnly}
      disabled={disabled}
      className={`w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle outline-none transition hover:border-primary/30 focus:border-primary focus:bg-surface focus:shadow-[var(--app-ring-focus)] disabled:cursor-not-allowed disabled:opacity-60 ${
        readOnly ? "cursor-default bg-surface hover:border-border focus:border-border focus:shadow-none" : ""
      } ${className}`}
    />
  );
}

export default Input;
