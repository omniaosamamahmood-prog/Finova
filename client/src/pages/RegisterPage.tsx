import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "../validations/auth.validation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post("/auth/register", data);
      setServerError("");
      console.log(response.data);
      navigate("/login");
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              {t("common.appName")}
            </h1>
            <p className="mt-2 text-fg-muted">{t("common.tagline")}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-fg">
          {t("auth.register.title")}
        </h2>
        <p className="mt-1 text-fg-muted">{t("auth.register.subtitle")}</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            placeholder={t("auth.register.fullName")}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-danger">
              {t(errors.fullName.message as string)}
            </p>
          )}

          <Input
            type="email"
            placeholder={t("auth.register.email")}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-danger">
              {t(errors.email.message as string)}
            </p>
          )}

          <Input
            type="password"
            placeholder={t("auth.register.password")}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-danger">
              {t(errors.password.message as string)}
            </p>
          )}

          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input
              type="checkbox"
              className="size-4 rounded border-border bg-surface accent-primary"
            />
            {t("auth.register.terms")}
          </label>

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <Button text={t("auth.register.createBtn")} type="submit" />
        </form>

        <p className="mt-8 text-center text-fg-muted">
          {t("auth.register.haveAccount")}{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            {t("auth.register.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
