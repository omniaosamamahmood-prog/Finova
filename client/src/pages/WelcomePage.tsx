import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import {
  getStoredLanguage,
  persistLanguage,
  type AppLanguage,
} from "../utils/language";

function FinanceHero() {
  return (
    <svg
      viewBox="0 0 480 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-md"
      aria-hidden="true"
    >
      <rect
        x="40"
        y="48"
        width="280"
        height="180"
        rx="24"
        fill="#1E293B"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <rect
        x="72"
        y="88"
        width="120"
        height="12"
        rx="6"
        fill="#334155"
        opacity="0.9"
      />
      <rect
        x="72"
        y="116"
        width="80"
        height="10"
        rx="5"
        fill="#334155"
        opacity="0.7"
      />
      <path
        d="M72 200 C110 180, 140 210, 178 168 C210 136, 240 150, 280 120"
        stroke="#2563EB"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="178" cy="168" r="5" fill="#2563EB" />
      <circle cx="280" cy="120" r="5" fill="#22C55E" />
      <rect x="200" y="140" width="220" height="140" rx="22" fill="#111827" />
      <rect
        x="224"
        y="168"
        width="72"
        height="10"
        rx="5"
        fill="#2563EB"
        opacity="0.85"
      />
      <rect x="224" y="192" width="140" height="28" rx="8" fill="#1E293B" />
      <text
        x="236"
        y="212"
        fill="#F8FAFC"
        fontSize="14"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontWeight="600"
      >
        24,850 EGP
      </text>
      <rect x="224" y="240" width="48" height="8" rx="4" fill="#334155" />
      <rect x="280" y="240" width="64" height="8" rx="4" fill="#22C55E" />
      <circle cx="380" cy="176" r="28" fill="#2563EB" opacity="0.2" />
      <circle cx="380" cy="176" r="16" fill="#2563EB" />
      <path
        d="M374 176 L378 180 L388 168"
        stroke="#F8FAFC"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(37_99_235_/_0.12)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgb(34_197_94_/_0.08)_0%,_transparent_45%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-16 h-80 w-80 rounded-full bg-success/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 lg:flex-row lg:gap-16 lg:px-10">
        <div className="welcome-fade w-full max-w-lg text-center lg:text-start">
          <p className="text-sm font-semibold tracking-[0.2em] text-fg-subtle uppercase">
            {t("welcome.eyebrow")}
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight text-fg sm:text-6xl">
            {t("welcome.title")}
          </h1>

          <h2 className="mt-4 text-xl font-semibold text-fg-muted sm:text-2xl">
            {t("welcome.subtitle")}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-fg-subtle sm:text-lg">
            {t("welcome.description")}
          </p>

          <p className="mt-8 text-sm font-medium text-fg-muted">
            {t("welcome.chooseLanguage")}
          </p>

          <div className="mt-3 space-y-3">
            <button
              type="button"
              onClick={() => selectLanguage("en")}
              aria-pressed={isEnSelected}
              className={`group flex w-full items-center gap-4 rounded-2xl border bg-surface px-5 py-4 text-start shadow-card transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isEnSelected
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border hover:border-primary/40 hover:bg-surface-hover"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                🇺🇸
              </span>
              <span className="flex-1">
                <span className="block text-base font-semibold text-fg">
                  {t("welcome.continueEn")}
                </span>
                <span className="mt-0.5 block text-sm text-fg-subtle">
                  English · LTR
                  {isEnSelected ? ` · ${t("welcome.selected")}` : ""}
                </span>
              </span>
              <span
                className={`text-lg ${isEnSelected ? "text-primary" : "text-fg-subtle"}`}
                aria-hidden="true"
              >
                {isEnSelected ? "✓" : "→"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => selectLanguage("ar")}
              aria-pressed={isArSelected}
              className={`group flex w-full items-center gap-4 rounded-2xl border bg-surface px-5 py-4 text-start shadow-card transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success ${
                isArSelected
                  ? "border-success ring-2 ring-success/25"
                  : "border-border hover:border-success/40 hover:bg-surface-hover"
              }`}
              dir="rtl"
            >
              <span className="text-2xl" aria-hidden="true">
                🇸🇦
              </span>
              <span className="flex-1">
                <span className="block text-base font-semibold text-fg">
                  {t("welcome.continueAr")}
                </span>
                <span className="mt-0.5 block text-sm text-fg-subtle">
                  العربية · RTL
                  {isArSelected ? ` · ${t("welcome.selected")}` : ""}
                </span>
              </span>
              <span
                className={`text-lg ${isArSelected ? "text-success" : "text-fg-subtle"}`}
                aria-hidden="true"
              >
                {isArSelected ? "✓" : "←"}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={continueToLogin}
            disabled={!selected}
            className="mt-6 w-full rounded-2xl bg-primary px-5 py-3.5 text-base font-semibold text-fg transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-surface disabled:text-fg-subtle disabled:hover:bg-surface"
          >
            {t("welcome.continue")}
          </button>
        </div>

        <div className="welcome-fade-delay mt-14 w-full max-w-md shrink-0 lg:mt-0">
          <FinanceHero />
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
