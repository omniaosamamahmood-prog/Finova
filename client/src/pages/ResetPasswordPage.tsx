import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AuthShell from "../components/ui/AuthShell";
import BrandMark from "../components/BrandMark";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useResetPassword } from "../hooks/useAuthEmail";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../validations/authEmail.validation";
import { getErrorMessage } from "../utils/errorMessage";

function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const resetMutation = useResetPassword();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!token) {
      setServerError(t("auth.reset.invalidToken"));
      return;
    }

    setServerError("");
    try {
      await resetMutation.mutateAsync({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch (error) {
      const key = getErrorMessage(error, "auth.reset.failed");
      setServerError(t(key, { defaultValue: key }));
    }
  });

  return (
    <AuthShell>
      <div className="ui-card p-8">
        <BrandMark />
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-fg">
          {t("auth.reset.title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("auth.reset.subtitle")}</p>

        {!token ? (
          <div className="mt-8 space-y-4">
            <p className="text-sm text-danger">{t("auth.reset.invalidToken")}</p>
            <Link
              to="/forgot-password"
              className="inline-flex text-sm font-semibold text-primary hover:underline"
            >
              {t("auth.reset.requestNew")}
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label
                htmlFor="reset-password"
                className="mb-1.5 block text-sm font-medium text-fg-muted"
              >
                {t("auth.reset.password")}
              </label>
              <Input
                id="reset-password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-danger">
                  {t(errors.password.message as string)}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reset-confirm"
                className="mb-1.5 block text-sm font-medium text-fg-muted"
              >
                {t("auth.reset.confirmPassword")}
              </label>
              <Input
                id="reset-confirm"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger">
                  {t(errors.confirmPassword.message as string)}
                </p>
              )}
            </div>

            {serverError && <p className="text-sm text-danger">{serverError}</p>}

            <Button
              type="submit"
              isLoading={resetMutation.isPending}
              text={t("auth.reset.submit")}
            />
          </form>
        )}
      </div>
    </AuthShell>
  );
}

export default ResetPasswordPage;
