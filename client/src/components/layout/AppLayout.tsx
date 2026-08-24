import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Wallet,
  Target,
  ChartPie,
  Repeat,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";
import BrandMark from "../BrandMark";
import FinovaAIChat from "../ai/FinovaAIChat";
import FeedbackButton from "../feedback/FeedbackButton";
import Avatar from "../ui/Avatar";
import { useProfile } from "../../hooks/useProfile";
import { useIsAdmin } from "../../hooks/useAdmin";
import { getStoredUser } from "../../utils/storedUser";

type AppLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { key: "dashboard", to: "/dashboard", icon: LayoutDashboard },
  { key: "transactions", to: "/transactions", icon: ArrowLeftRight },
  { key: "categories", to: "/categories", icon: Tags },
  { key: "budgets", to: "/budgets", icon: Wallet },
  { key: "goals", to: "/goals", icon: Target },
  { key: "recurring", to: "/recurring-transactions", icon: Repeat },
  { key: "reports", to: "/reports", icon: ChartPie },
  { key: "settings", to: "/settings", icon: Settings },
] as const;

function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const { data: profile } = useProfile();
  const isAdmin = useIsAdmin();
  const user = profile ?? storedUser;
  const userName = user.fullName || t("common.appName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      isActive
        ? "bg-primary-muted text-primary"
        : "text-fg-muted hover:bg-surface hover:text-fg"
    }`;

  return (
    <div className="min-h-screen bg-bg md:flex">
      <header className="sticky top-0 z-20 border-b border-border bg-bg-elevated/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <BrandMark compact />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-danger/30 bg-danger-muted px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              {t("navigation.logout")}
            </button>
          </div>
        </div>

        <nav
          className="-mx-4 mt-3 flex gap-1 overflow-x-auto px-4 pb-1"
          aria-label={t("common.mainNav")}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-fg-muted hover:bg-surface hover:text-fg"
                }`
              }
            >
              <item.icon className="size-4" aria-hidden />
              {t(`navigation.${item.key}`)}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-fg-muted hover:bg-surface hover:text-fg"
                }`
              }
            >
              <ShieldCheck className="size-4" aria-hidden />
              {t("navigation.adminPlatform")}
            </NavLink>
          )}
        </nav>
      </header>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-e border-border bg-bg-elevated md:flex">
        <div className="flex h-full flex-col px-5 py-6">
          <BrandMark />

          <nav className="mt-8 flex flex-col gap-1" aria-label={t("common.mainNav")}>
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
                    <item.icon className="size-4 shrink-0" aria-hidden />
                    {t(`navigation.${item.key}`)}
                  </>
                )}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-2 start-0 w-1 rounded-full bg-primary"
                      />
                    )}
                    <ShieldCheck className="size-4 shrink-0" aria-hidden />
                    {t("navigation.adminPlatform")}
                  </>
                )}
              </NavLink>
            )}
          </nav>

          <div className="mt-auto space-y-3 border-t border-border pt-5">
            <NavLink
              to="/settings"
              aria-label={t("navigation.settings")}
              className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5 transition hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
              <span className="min-w-0 text-start">
                <span className="block truncate text-sm font-semibold text-fg">
                  {userName}
                </span>
                {user.email && (
                  <span className="block truncate text-xs text-fg-subtle">
                    {user.email}
                  </span>
                )}
              </span>
            </NavLink>
            <LanguageSwitcher className="w-full" />
            <ThemeToggle className="w-full" showLabel />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger-muted px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              <LogOut className="size-4" aria-hidden />
              {t("navigation.logout")}
            </button>
          </div>
        </div>
      </aside>

      <main className="relative min-w-0 flex-1">
        <div className="pointer-events-none absolute inset-0 app-glow-soft" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>

      <FeedbackButton />
      <FinovaAIChat />
    </div>
  );
}

export default AppLayout;
