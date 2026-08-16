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
import { useTranslation } from "react-i18next";

function LoginPage() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError("");
      const response = await api.post("auth/login", data);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || t("auth.server.registrationFailed")
        );
      } else {
        setServerError(t("auth.server.somethingWrong"));
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-card">
        <div>
          <h1 className="text-4xl font-bold text-primary">
            {t("common.appName")}
          </h1>
          <p className="mt-2 text-fg-muted">{t("common.tagline")}</p>
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-fg">
          {t("auth.login.title")}
        </h2>
        <p className="mt-1 text-fg-muted">{t("auth.login.subtitle")}</p>

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

          <p className="cursor-pointer text-end text-sm text-primary hover:underline">
            {t("auth.login.forgot")}
          </p>

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <Button text={t("auth.login.loginBtn")} type="submit" />
        </form>

        <p className="mt-8 text-center text-fg-muted">
          {t("auth.login.noAccount")}{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            {t("auth.login.register")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
