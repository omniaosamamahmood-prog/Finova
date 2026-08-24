import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import AuthShell from "../components/ui/AuthShell";
import BrandMark from "../components/BrandMark";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useResendVerification } from "../hooks/useAuthEmail";
import {
  resendVerificationSchema,
  type ResendVerificationFormData,
} from "../validations/authEmail.validation";
import { getErrorMessage } from "../utils/errorMessage";

type LocationState = {
  email?: string;
  emailSent?: boolean;
  registerMessage?: string;
};

function EmailVerificationSentPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const initialEmail = useMemo(
    () => (typeof state.email === "string" ? state.email : ""),
    [state.email]
  );

  const resendMutation = useResendVerification();
  const [serverError, setServerError] = useState(() =>
    state.emailSent === false ? t("auth.email.deliveryRestricted") : ""
  );
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: initialEmail },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError("");
    setSuccessMessage("");
    try {
      await resendMutation.mutateAsync(data.email.trim().toLowerCase());
      setSuccessMessage(t("auth.verificationSent.resendSuccess"));
    } catch (error) {
      const key = getErrorMessage(error, "auth.verificationSent.resendFailed");
      setServerError(t(key, { defaultValue: key }));
    }
  });

  return (
    <AuthShell>
      <div className="ui-card p-8">
        <BrandMark />
        <span className="mt-8 grid size-14 place-items-center rounded-2xl bg-primary-muted text-primary">
          <Mail className="size-7" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-fg">
          {t("auth.verificationSent.title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          {t("auth.verificationSent.subtitle")}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-fg-subtle">
          {t("auth.verificationSent.resendHint")}
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label
              htmlFor="resend-email"
              className="mb-1.5 block text-sm font-medium text-fg-muted"
            >
              {t("auth.verificationSent.email")}
            </label>
            <Input
              id="resend-email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger">
                {t(errors.email.message as string)}
              </p>
            )}
          </div>

          {successMessage && (
            <p className="rounded-xl border border-success/25 bg-success-muted px-4 py-3 text-sm font-medium text-success">
              {successMessage}
            </p>
          )}
          {serverError && (
            <p className="rounded-xl border border-danger/25 bg-danger-muted px-4 py-3 text-sm font-medium text-danger">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            isLoading={resendMutation.isPending}
            text={t("auth.verificationSent.resend")}
          />
        </form>

        <p className="mt-8 text-center text-sm text-fg-muted">
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t("auth.verificationSent.backToLogin")}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default EmailVerificationSentPage;
