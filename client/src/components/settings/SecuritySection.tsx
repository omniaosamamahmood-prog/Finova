import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../../validations/profile.validation";

type SecuritySectionProps = {
  isSaving: boolean;
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
};

function SecuritySection({ isSaving, onSubmit }: SecuritySectionProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const submit = handleSubmit(async (data) => {
    await onSubmit(data);
    reset();
  });

  return (
    <form className="grid min-w-0 gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
      <div className="min-w-0 sm:col-span-2">
        <label
          htmlFor="settings-current-password"
          className="mb-1.5 block text-sm font-medium text-fg-muted"
        >
          {t("settings.security.currentPassword")}
        </label>
        <Input
          id="settings-current-password"
          type="password"
          autoComplete="current-password"
          disabled={isSaving}
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.currentPassword.message as string)}
          </p>
        )}
      </div>

      <div className="min-w-0">
        <label
          htmlFor="settings-new-password"
          className="mb-1.5 block text-sm font-medium text-fg-muted"
        >
          {t("settings.security.newPassword")}
        </label>
        <Input
          id="settings-new-password"
          type="password"
          autoComplete="new-password"
          disabled={isSaving}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.newPassword.message as string)}
          </p>
        )}
      </div>

      <div className="min-w-0">
        <label
          htmlFor="settings-confirm-password"
          className="mb-1.5 block text-sm font-medium text-fg-muted"
        >
          {t("settings.security.confirmPassword")}
        </label>
        <Input
          id="settings-confirm-password"
          type="password"
          autoComplete="new-password"
          disabled={isSaving}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.confirmPassword.message as string)}
          </p>
        )}
      </div>

      <div className="flex sm:col-span-2 sm:justify-end">
        <Button
          type="submit"
          className="w-full sm:w-auto sm:px-6"
          isLoading={isSaving}
          disabled={isSaving}
        >
          {t("settings.security.updatePassword")}
        </Button>
      </div>
    </form>
  );
}

export default SecuritySection;
