import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AuthShell from "../components/ui/AuthShell";
import BrandMark from "../components/BrandMark";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useForgotPassword } from "../hooks/useAuthEmail";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../validations/authEmail.validation";
import { getErrorMessage } from "../utils/errorMessage";

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const forgotMutation = useForgotPassword();
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError("");
    try {
      await forgotMutation.mutateAsync(data.email.trim().toLowerCase());
      setSent(true);
    } catch (error) {
      const key = getErrorMessage(error, "auth.forgot.sendFailed");
      setServerError(t(key, { defaultValue: key }));
    }
  });

  return (
    <AuthShell>
      <div className="ui-card p-8">
        <BrandMark />
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-fg">
          {t("auth.forgot.title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("auth.forgot.subtitle")}</p>

        {sent ? (
          <div className="mt-8 space-y-4 text-start">
            <p className="rounded-xl border border-success/25 bg-success-muted px-4 py-3 text-sm font-medium text-success">
              {t("auth.forgot.success")}
            </p>
            <Link
              to="/login"
              className="inline-flex text-sm font-semibold text-primary hover:underline"
            >
              {t("auth.forgot.backToLogin")}
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label
                htmlFor="forgot-email"
                className="mb-1.5 block text-sm font-medium text-fg-muted"
              >
                {t("auth.forgot.email")}
              </label>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder={t("auth.forgot.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger">
                  {t(errors.email.message as string)}
                </p>
              )}
            </div>

            {serverError && <p className="text-sm text-danger">{serverError}</p>}

            <Button
              type="submit"
              isLoading={forgotMutation.isPending}
              text={t("auth.forgot.submit")}
            />

            <p className="text-center text-sm text-fg-muted">
              <Link to="/login" className="font-semibold text-primary hover:underline">
                {t("auth.forgot.backToLogin")}
              </Link>
            </p>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

export default ForgotPasswordPage;
