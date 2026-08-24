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
import AuthShell from "../components/ui/AuthShell";
import BrandMark from "../components/BrandMark";
import AuthGoogleSection from "../components/auth/AuthGoogleSection";

function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post("/auth/register", data);
      setServerError("");
      navigate("/email-verification-sent", {
        state: {
          email: data.email.trim().toLowerCase(),
          emailSent: response.data.emailSent !== false,
          registerMessage: response.data.message as string | undefined,
        },
      });
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
    <AuthShell>
      <div className="ui-card p-8">
        <BrandMark />

        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-fg">
          {t("auth.register.title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          {t("auth.register.subtitle")}
        </p>

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

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <Button
            text={t("auth.register.createBtn")}
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
          {t("auth.register.haveAccount")}{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            {t("auth.register.login")}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default RegisterPage;
