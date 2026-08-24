import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Button from "../ui/Button";
import AvatarPicker from "./AvatarPicker";
import type { Profile } from "../../types/api";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "../../validations/profile.validation";
import { formatDate } from "../../utils/format";

type ProfileSectionProps = {
  profile: Profile;
  isSaving: boolean;
  onSave: (payload: {
    fullName: string;
    avatar?: File;
    removeAvatar?: boolean;
  }) => Promise<void>;
  onValidationError: (messageKey: string) => void;
};

function ProfileSection({
  profile,
  isSaving,
  onSave,
  onValidationError,
}: ProfileSectionProps) {
  const { t, i18n } = useTranslation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
    },
  });

  useEffect(() => {
    reset({ fullName: profile.fullName });
    setAvatarFile(null);
    setRemoveAvatar(false);
  }, [profile, reset]);

  const fullName = watch("fullName") || profile.fullName;

  const onSubmit = handleSubmit(async (data) => {
    await onSave({
      fullName: data.fullName,
      avatar: avatarFile ?? undefined,
      removeAvatar: removeAvatar && !avatarFile,
    });
  });

  return (
    <form className="min-w-0" onSubmit={onSubmit} noValidate>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:gap-8">
        <div className="rounded-2xl border border-border-subtle bg-bg p-5 sm:p-6">
          <AvatarPicker
            key={profile.avatarUrl ?? "none"}
            name={fullName}
            currentUrl={removeAvatar ? null : profile.avatarUrl}
            disabled={isSaving}
            onFileChange={(file) => {
              setAvatarFile(file);
              if (file) {
                setRemoveAvatar(false);
              }
            }}
            onRemove={() => {
              setAvatarFile(null);
              setRemoveAvatar(true);
            }}
            onValidationError={onValidationError}
          />
        </div>

        <div className="grid min-w-0 content-start gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label
              htmlFor="settings-full-name"
              className="mb-1.5 block text-sm font-medium text-fg-muted"
            >
              {t("settings.profile.fullName")}
            </label>
            <Input
              id="settings-full-name"
              autoComplete="name"
              disabled={isSaving}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-danger">
                {t(errors.fullName.message as string)}
              </p>
            )}
          </div>

          <div className="min-w-0">
            <label
              htmlFor="settings-email"
              className="mb-1.5 block text-sm font-medium text-fg-muted"
            >
              {t("settings.profile.email")}
            </label>
            <Input
              id="settings-email"
              type="email"
              value={profile.email}
              readOnly
            />
            <p className="mt-1 text-xs text-fg-subtle">
              {t("settings.profile.emailHint")}
            </p>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="settings-created-at"
              className="mb-1.5 block text-sm font-medium text-fg-muted"
            >
              {t("settings.profile.createdAt")}
            </label>
            <Input
              id="settings-created-at"
              value={formatDate(profile.createdAt, i18n.language)}
              readOnly
            />
          </div>

          <div className="flex sm:col-span-2 sm:justify-end">
            <Button
              type="submit"
              className="w-full sm:w-auto sm:px-6"
              isLoading={isSaving}
              disabled={isSaving}
            >
              {t("settings.profile.save")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ProfileSection;
