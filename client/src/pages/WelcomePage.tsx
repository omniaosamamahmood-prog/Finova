import { Link, useNavigate } from "react-router-dom";
import { useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftRight,
  Check,
  ChevronRight,
  Target,
  Wallet,
} from "lucide-react";
import i18n from "../i18n";
import {
  getStoredLanguage,
  persistLanguage,
  type AppLanguage,
} from "../utils/language";
import ThemeToggle from "../components/ThemeToggle";
import BrandMark from "../components/BrandMark";
import Button from "../components/ui/Button";
import { formatCurrency } from "../utils/format";

function ProductPreview() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2rem] bg-primary/8 blur-2xl" aria-hidden />
      <div className="ui-card relative overflow-hidden p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-fg-subtle uppercase">
              {t("navigation.dashboard")}
            </p>
            <p className="mt-1 text-sm text-fg-muted">{t("welcome.preview.caption")}</p>
          </div>
          <span className="rounded-full bg-success-muted px-2.5 py-1 text-xs font-semibold text-success">
            {t("welcome.preview.live")}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-bg px-4 py-3">
            <p className="text-xs text-fg-subtle">{t("welcome.preview.balance")}</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-fg">
              {formatCurrency(24850, locale)}
            </p>
          </div>
          <div className="rounded-2xl bg-bg px-4 py-3">
            <p className="text-xs text-fg-subtle">{t("welcome.preview.income")}</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-success">
              {formatCurrency(18200, locale)}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-fg">{t("welcome.preview.food")}</span>
            <span className="tabular-nums text-fg-muted">72%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
            <div
              className="enter-bar h-full w-[72%] rounded-full bg-primary"
              style={{ "--enter-delay": "520ms" } as CSSProperties}
            />
          </div>
          <div className="mt-4 mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-fg">{t("welcome.preview.rent")}</span>
            <span className="tabular-nums text-fg-muted">91%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
            <div
              className="enter-bar h-full w-[91%] rounded-full bg-warning"
              style={{ "--enter-delay": "640ms" } as CSSProperties}
            />
          </div>
        </div>

        <div className="mt-5 space-y-2.5 border-t border-border-subtle pt-4">
          {[
            { title: t("welcome.preview.tx1"), amount: -245, tone: "danger" as const },
            { title: t("welcome.preview.tx2"), amount: 8500, tone: "success" as const },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-fg-muted">{item.title}</span>
              <span
                className={`shrink-0 font-semibold tabular-nums ${
                  item.tone === "success" ? "text-success" : "text-danger"
                }`}
              >
                {item.amount > 0 ? "+" : ""}
                {formatCurrency(item.amount, locale)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WelcomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const storedLanguage = getStoredLanguage();
  const [selected, setSelected] = useState<AppLanguage | null>(storedLanguage);

  const applyLanguage = (lng: AppLanguage) => {
    persistLanguage(lng);
    void i18n.changeLanguage(lng);
  };

  const selectLanguage = (lng: AppLanguage) => {
    setSelected(lng);
    applyLanguage(lng);
  };

  const continueToLogin = () => {
    if (!selected) return;
    applyLanguage(selected);
    navigate("/login", { replace: true });
  };

  const isEnSelected = selected === "en";
  const isArSelected = selected === "ar";

  const features = [
    {
      icon: ArrowLeftRight,
      title: t("welcome.features.track.title"),
      description: t("welcome.features.track.description"),
    },
    {
      icon: Wallet,
      title: t("welcome.features.budget.title"),
      description: t("welcome.features.budget.description"),
    },
    {
      icon: Target,
      title: t("welcome.features.goals.title"),
      description: t("welcome.features.goals.description"),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 app-glow" />
      <div className="pointer-events-none absolute -start-24 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -end-16 bottom-0 h-96 w-96 rounded-full bg-success/10 blur-3xl" />

      <header className="enter enter-down relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <BrandMark />
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-fg-muted transition hover:bg-surface hover:text-fg sm:inline-flex"
          >
            {t("welcome.login")}
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 sm:pt-10 lg:pb-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="text-start">
            <p
              className="enter enter-from-end inline-flex rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-primary uppercase"
              style={{ "--enter-delay": "80ms" } as CSSProperties}
            >
              {t("welcome.badge")}
            </p>

            <h1
              className="welcome-headline enter enter-from-end mt-5 max-w-xl font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-fg sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]"
              style={{ "--enter-delay": "150ms" } as CSSProperties}
            >
              {t("welcome.headline")}
            </h1>

            <p
              className="enter enter-from-end mt-4 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg"
              style={{ "--enter-delay": "220ms" } as CSSProperties}
            >
              {t("welcome.description")}
            </p>

            <p
              className="enter enter-from-end mt-8 text-sm font-semibold text-fg"
              style={{ "--enter-delay": "290ms" } as CSSProperties}
            >
              {t("welcome.chooseLanguage")}
            </p>

            <div
              className="enter enter-from-end mt-3 grid gap-3 sm:grid-cols-2"
              style={{ "--enter-delay": "350ms" } as CSSProperties}
            >
              <button
                type="button"
                onClick={() => selectLanguage("en")}
                aria-pressed={isEnSelected}
                className={`flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 text-start transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isEnSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40 hover:bg-surface-hover"
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-full text-xs font-bold ${
                    isEnSelected
                      ? "bg-primary text-white"
                      : "bg-surface-hover text-fg-muted"
                  }`}
                >
                  EN
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-fg">
                    {t("language.english")}
                  </span>
                  <span className="block text-xs text-fg-subtle">
                    {isEnSelected ? t("welcome.selected") : "LTR"}
                  </span>
                </span>
                {isEnSelected && <Check className="size-4 text-primary" aria-hidden />}
              </button>

              <button
                type="button"
                onClick={() => selectLanguage("ar")}
                aria-pressed={isArSelected}
                dir="rtl"
                className={`flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 text-start transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isArSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40 hover:bg-surface-hover"
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-full text-xs font-bold ${
                    isArSelected
                      ? "bg-primary text-white"
                      : "bg-surface-hover text-fg-muted"
                  }`}
                >
                  ع
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-fg">
                    {t("language.arabic")}
                  </span>
                  <span className="block text-xs text-fg-subtle">
                    {isArSelected ? t("welcome.selected") : "RTL"}
                  </span>
                </span>
                {isArSelected && <Check className="size-4 text-primary" aria-hidden />}
              </button>
            </div>

            <div
              className="enter enter-from-end mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ "--enter-delay": "420ms" } as CSSProperties}
            >
              <Button
                type="button"
                className="sm:w-auto sm:px-6"
                onClick={continueToLogin}
                disabled={!selected}
              >
                {t("welcome.continue")}
                <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
              <Link
                to="/login"
                className="text-center text-sm font-medium text-fg-muted hover:text-primary sm:text-start"
              >
                {t("welcome.haveAccount")}
              </Link>
            </div>
          </div>

          <div
            className="enter enter-from-start"
            style={{ "--enter-delay": "120ms" } as CSSProperties}
          >
            <ProductPreview />
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3 lg:mt-20">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="enter enter-up ui-card p-5"
              style={
                { "--enter-delay": `${480 + index * 90}ms` } as CSSProperties
              }
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary-muted text-primary">
                <feature.icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-semibold text-fg">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default WelcomePage;
