import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary-hover focus-visible:ring-primary/40",
  secondary:
    "bg-surface text-fg border border-border hover:bg-surface-hover focus-visible:ring-border",
  danger:
    "bg-danger text-white shadow-sm shadow-danger/20 hover:bg-danger-hover focus-visible:ring-danger/40",
};

function Button({
  text,
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children ?? text}
    </button>
  );
}

export default Button;
