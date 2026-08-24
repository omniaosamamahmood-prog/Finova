import type { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";

type AuthShellProps = {
  children: ReactNode;
};

function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-12">
      <div className="pointer-events-none absolute inset-0 app-glow" />
      <div className="pointer-events-none absolute -start-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-16 bottom-16 h-80 w-80 rounded-full bg-success/10 blur-3xl" />

      <div className="absolute end-4 top-4 z-20 flex items-center gap-2 sm:end-6 sm:top-6">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}

export default AuthShell;
