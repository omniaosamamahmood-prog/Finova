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
  Lock,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";
import BrandMark from "../BrandMark";
import FinovaAIChat from "../ai/FinovaAIChat";
import FeedbackButton from "../feedback/FeedbackButton";
import Avatar from "../ui/Avatar";
import MobileNavScroll from "./MobileNavScroll";
import { useProfile } from "../../hooks/useProfile";
import { useIsAdmin } from "../../hooks/useAdmin";
import { usePlan } from "../../contexts/PlanContext";
import { getStoredUser } from "../../utils/storedUser";
import type { PremiumFeature } from "../../utils/plan";
import PlanBadge from "../premium/PlanBadge";

type AppLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { key: "dashboard", to: "/dashboard", icon: LayoutDashboard },
  { key: "transactions", to: "/transactions", icon: ArrowLeftRight },
  { key: "categories", to: "/categories", icon: Tags },
  { key: "budgets", to: "/budgets", icon: Wallet },
  { key: "goals", to: "/goals", icon: Target, premium: true },
  { key: "recurring", to: "/recurring-transactions", icon: Repeat, premium: true },
  { key: "reports", to: "/reports", icon: ChartPie },
  { key: "settings", to: "/settings", icon: Settings },
] as const;

function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const { data: profile } = useProfile();
  const isAdmin = useIsAdmin();
  const { isPremium, openUpgradeModal } = usePlan();
  const user = profile ?? storedUser;
  const userName = user.fullName || t("common.appName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const interceptPremiumNav = (
    event: { preventDefault: () => void },
    item: (typeof navItems)[number]
  ) => {
    if (!("premium" in item) || !item.premium || isPremium) return;
    event.preventDefault();
    openUpgradeModal(item.key as PremiumFeature);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      isActive
        ? "bg-primary-muted text-primary"
        : "text-fg-muted hover:bg-surface hover:text-fg"
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-medium leading-none tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      isActive
        ? "bg-primary-muted text-primary"
        : "text-fg-muted hover:bg-surface hover:text-fg"
    }`;

  return (
    <div className="min-h-screen bg-bg md:flex">
      <header className="sticky top-0 z-20 bg-bg-elevated/95 px-3 pt-2 backdrop-blur md:hidden">
        <div className="flex h-9 items-center justify-between gap-2">
          <BrandMark compact />
          <div className="flex items-center gap-1.5">
            <ThemeToggle className="!rounded-lg !px-2 !py-1.5" />
            <button
              type="button"
              onClick={handleLogout}
              aria-label={t("navigation.logout")}
              title={t("navigation.logout")}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-danger/30 bg-danger-muted text-danger transition hover:bg-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              <LogOut className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>

        <MobileNavScroll aria-label={t("common.mainNav")}>
          {navItems.map((item) => {
            const locked = "premium" in item && item.premium && !isPremium;
            return (
            <NavLink
              key={item.key}
              to={item.to}
              className={mobileNavClass}
              onClick={(event) => interceptPremiumNav(event, item)}
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <item.icon className="size-4 shrink-0" aria-hidden />
                    {locked && (
                      <Lock
                        className="absolute -end-1.5 -top-1 size-2.5 text-warning"
                        aria-hidden
                      />
                    )}
                  </span>
                  <span className="max-w-[4.5rem] truncate">
                    {t(`navigation.${item.key}`)}
                  </span>
                  {isActive && !locked && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
                    />
                  )}
                </>
              )}
            </NavLink>
            );
          })}
          {isAdmin && (
            <NavLink to="/admin" className={mobileNavClass}>
              {({ isActive }) => (
                <>
                  <ShieldCheck className="size-4 shrink-0" aria-hidden />
                  <span className="max-w-[4.5rem] truncate">
                    {t("navigation.adminPlatform")}
                  </span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
                    />
                  )}
                </>
              )}
            </NavLink>
          )}
        </MobileNavScroll>
      </header>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-e border-border bg-bg-elevated md:flex">
        <div className="flex h-full flex-col px-5 py-6">
          <BrandMark />

          <nav className="mt-8 flex flex-col gap-1" aria-label={t("common.mainNav")}>
            {navItems.map((item) => {
              const locked = "premium" in item && item.premium && !isPremium;
              return (
              <NavLink
                key={item.key}
                to={item.to}
                className={linkClass}
                onClick={(event) => interceptPremiumNav(event, item)}
              >
                {({ isActive }) => (
                  <>
                    {isActive && !locked && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-2 start-0 w-1 rounded-full bg-primary"
                      />
                    )}
                    <item.icon className="size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 truncate">
                      {t(`navigation.${item.key}`)}
                    </span>
                    {locked && (
                      <Lock
                        className="size-3.5 shrink-0 text-warning"
                        aria-label={t("premium.lockAria")}
                      />
                    )}
                  </>
                )}
              </NavLink>
              );
            })}
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
                <span className="flex min-w-0 items-center gap-2">
                  <span className="block truncate text-sm font-semibold text-fg">
                    {userName}
                  </span>
                  <PlanBadge
                    plan={isPremium ? "PREMIUM" : "FREE"}
                    className="shrink-0"
                  />
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
        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 md:py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>

      <FeedbackButton />
      <FinovaAIChat />
    </div>
  );
}

export default AppLayout;
