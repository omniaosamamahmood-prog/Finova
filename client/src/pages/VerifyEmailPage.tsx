import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, CircleX, Loader2, TimerOff } from "lucide-react";
import AuthShell from "../components/ui/AuthShell";
import BrandMark from "../components/BrandMark";
import Button from "../components/ui/Button";
import { verifyEmail } from "../services/authEmail.service";

type VerifyView = "loading" | "success" | "expired" | "failed";

function VerifyEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const token = searchParams.get("token")?.trim() ?? "";
  const started = useRef(false);

  const [view, setView] = useState<VerifyView>(() => {
    if (statusParam === "success") return "success";
    if (statusParam === "expired") return "expired";
    if (statusParam === "failed") return "failed";
    if (token) return "loading";
    return "failed";
  });

  useEffect(() => {
    if (statusParam || !token || started.current) return;
    started.current = true;

    void verifyEmail(token)
      .then((result) => {
        setView(result.status);
      })
      .catch(() => {
        setView("failed");
      });
  }, [statusParam, token]);

  const content = {
    loading: {
      icon: Loader2,
      title: t("auth.verify.loadingTitle"),
      body: t("auth.verify.loadingBody"),
      tone: "text-primary",
      spin: true,
    },
    success: {
      icon: CheckCircle2,
      title: t("auth.verify.successTitle"),
      body: t("auth.verify.successBody"),
      tone: "text-success",
      spin: false,
    },
    expired: {
      icon: TimerOff,
      title: t("auth.verify.expiredTitle"),
      body: t("auth.verify.expiredBody"),
      tone: "text-warning",
      spin: false,
    },
    failed: {
      icon: CircleX,
      title: t("auth.verify.failedTitle"),
      body: t("auth.verify.failedBody"),
      tone: "text-danger",
      spin: false,
    },
  }[view];

  const Icon = content.icon;

  return (
    <AuthShell>
      <div className="ui-card p-8 text-center">
        <BrandMark />
        <span
          className={`mx-auto mt-8 grid size-14 place-items-center rounded-2xl bg-surface ${content.tone}`}
        >
          <Icon
            className={`size-7 ${content.spin ? "animate-spin" : ""}`}
            aria-hidden
          />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-fg">
          {content.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{content.body}</p>

        <div className="mt-8 flex flex-col gap-3">
          {view === "success" && (
            <Link to="/login">
              <Button type="button" text={t("auth.verify.goToLogin")} />
            </Link>
          )}
          {(view === "expired" || view === "failed") && (
            <>
              <Link to="/email-verification-sent">
                <Button type="button" text={t("auth.verify.resend")} />
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-primary hover:underline"
              >
                {t("auth.verify.goToLogin")}
              </Link>
            </>
          )}
        </div>
      </div>
    </AuthShell>
  );
}

export default VerifyEmailPage;
