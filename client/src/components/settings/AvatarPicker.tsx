import { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import {
  ACCEPTED_AVATAR_TYPES,
  MAX_AVATAR_BYTES,
} from "../../validations/profile.validation";

type AvatarPickerProps = {
  name?: string;
  currentUrl?: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  onValidationError: (messageKey: string) => void;
};

function isAcceptedType(type: string) {
  return (ACCEPTED_AVATAR_TYPES as readonly string[]).includes(type);
}

function AvatarPicker({
  name,
  currentUrl,
  disabled = false,
  onFileChange,
  onRemove,
  onValidationError,
}: AvatarPickerProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displaySrc = previewUrl ?? currentUrl;
  const canRemove = Boolean(previewUrl || currentUrl);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!isAcceptedType(file.type)) {
      onValidationError("settings.validation.avatarType");
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      onValidationError("settings.validation.avatarSize");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileChange(null);
    onRemove();
  };

  return (
    <div className="flex h-full min-w-0 flex-col items-center justify-center text-center">
      <Avatar name={name} src={displaySrc} size="lg" />
      {name && (
        <p className="mt-3 max-w-full truncate text-sm font-semibold text-fg">
          {name}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_AVATAR_TYPES.join(",")}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="mt-4 flex w-full flex-col gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={handlePick}
        >
          <Camera className="size-4" aria-hidden />
          {currentUrl || previewUrl
            ? t("settings.profile.replacePhoto")
            : t("settings.profile.uploadPhoto")}
        </Button>
        {canRemove && (
          <Button
            type="button"
            variant="danger"
            disabled={disabled}
            onClick={handleRemove}
          >
            <Trash2 className="size-4" aria-hidden />
            {t("settings.profile.removePhoto")}
          </Button>
        )}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-fg-subtle">
        {t("settings.profile.avatarHint")}
      </p>
    </div>
  );
}

export default AvatarPicker;
