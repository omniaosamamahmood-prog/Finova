import { useTranslation } from "react-i18next";

type SidebarProps = {
  onLogout: () => void;
};

const navItems = [
  { key: "dashboard", active: true },
  { key: "transactions", active: false },
  { key: "accounts", active: false },
  { key: "budgets", active: false },
  { key: "goals", active: false },
] as const;

function Sidebar({ onLogout }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-bg-elevated px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-primary">
            {t("common.appName")}
          </h1>
          <button
            type="button"
            onClick={onLogout}
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
            <button
              key={item.key}
              type="button"
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                item.active
                  ? "bg-primary-muted text-primary"
                  : "text-fg-muted hover:bg-surface hover:text-fg"
              }`}
            >
              {t(`navigation.${item.key}`)}
            </button>
          ))}
        </nav>
      </header>

      {/* Desktop sidebar — position follows document direction (LTR left / RTL right) */}
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-bg-elevated md:flex">
        <div className="flex h-full min-h-screen flex-col px-5 py-6">
          <h1 className="px-2 text-2xl font-bold tracking-tight text-primary">
            {t("common.appName")}
          </h1>

          <nav className="mt-8 flex flex-col gap-1.5" aria-label="Main">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`relative w-full rounded-xl px-4 py-2.5 text-start text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  item.active
                    ? "bg-primary-muted text-primary"
                    : "text-fg-muted hover:bg-surface hover:text-fg"
                }`}
              >
                {item.active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-2 start-0 w-1 rounded-full bg-primary"
                  />
                )}
                {t(`navigation.${item.key}`)}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-border pt-5">
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-xl border border-danger/30 bg-danger-muted px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              {t("navigation.logout")}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
