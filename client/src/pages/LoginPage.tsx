import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import {
  loginSchema,
  type LoginFormData,
} from "../validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import { persistAuthSession } from "../services/auth.service";
import { useTranslation } from "react-i18next";
import AuthShell from "../components/ui/AuthShell";
import BrandMark from "../components/BrandMark";
import AuthGoogleSection from "../components/auth/AuthGoogleSection";

function LoginPage() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError("");
      const response = await api.post("auth/login", data);
      persistAuthSession(response.data.data);
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message as string | undefined;
        if (message === "Please verify your email") {
          setServerError(t("auth.login.verifyRequired"));
          return;
        }
        setServerError(
          message
            ? t(message, { defaultValue: message })
            : t("auth.server.registrationFailed")
        );
      } else {
        setServerError(t("auth.server.somethingWrong"));
      }
    }
  };

  return (
    <AuthShell>
      <div className="ui-card p-8">
        <BrandMark />

        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-fg">
          {t("auth.login.title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("auth.login.subtitle")}</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-danger">
              {t(errors.email.message as string)}
            </p>
          )}

          <Input
            type="password"
            placeholder={t("auth.login.passwordPlaceholder")}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-danger">
              {t(errors.password.message as string)}
            </p>
          )}

          <p className="text-end text-sm font-medium">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              {t("auth.login.forgot")}
            </Link>
          </p>

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <Button
            text={t("auth.login.loginBtn")}
            type="submit"
            isLoading={isSubmitting}
          />
        </form>

        <AuthGoogleSection
          disabled={isSubmitting}
          onSuccess={() => navigate("/dashboard")}
          onError={(messageKey) =>
            setServerError(t(messageKey, { defaultValue: messageKey }))
          }
        />

        <p className="mt-8 text-center text-sm text-fg-muted">
          {t("auth.login.noAccount")}{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            {t("auth.login.register")}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default LoginPage;
