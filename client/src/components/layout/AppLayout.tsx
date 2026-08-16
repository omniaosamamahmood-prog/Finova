import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { key: "dashboard", to: "/dashboard" },
  { key: "transactions", to: "/transactions" },
] as const;

const upcomingItems = ["accounts", "budgets", "goals"] as const;

function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative w-full rounded-xl px-4 py-2.5 text-start text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      isActive
        ? "bg-primary-muted text-primary"
        : "text-fg-muted hover:bg-surface hover:text-fg"
    }`;

  return (
    <div className="min-h-screen bg-bg md:flex">
      <header className="sticky top-0 z-20 border-b border-border bg-bg-elevated px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-primary">
            {t("common.appName")}
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-danger/30 bg-danger-muted px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          >
            {t("navigation.logout")}
          </button>
        </div>

        <nav
          className="-mx-4 mt-3 flex gap-1 overflow-x-auto px-4 pb-1"
          aria-label={t("navigation.dashboard")}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary-muted text-primary"
                    : "text-fg-muted hover:bg-surface hover:text-fg"
                }`
              }
            >
              {t(`navigation.${item.key}`)}
            </NavLink>
          ))}
        </nav>
      </header>

      <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-bg-elevated md:flex">
        <div className="flex h-full min-h-screen flex-col px-5 py-6">
          <h1 className="px-2 text-2xl font-bold tracking-tight text-primary">
            {t("common.appName")}
          </h1>

          <nav className="mt-8 flex flex-col gap-1.5" aria-label="Main">
            {navItems.map((item) => (
              <NavLink key={item.key} to={item.to} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-2 start-0 w-1 rounded-full bg-primary"
                      />
                    )}
                    {t(`navigation.${item.key}`)}
                  </>
                )}
              </NavLink>
            ))}

            {upcomingItems.map((key) => (
              <button
                key={key}
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-xl px-4 py-2.5 text-start text-sm font-medium text-fg-subtle opacity-60"
              >
                {t(`navigation.${key}`)}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-border pt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-danger/30 bg-danger-muted px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              {t("navigation.logout")}
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
