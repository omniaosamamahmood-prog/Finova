import { useTranslation } from "react-i18next";
import GoogleSignInButton from "./GoogleSignInButton";

type AuthGoogleSectionProps = {
  onSuccess: () => void;
  onError: (messageKey: string) => void;
  disabled?: boolean;
};

function AuthGoogleSection({
  onSuccess,
  onError,
  disabled = false,
}: AuthGoogleSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3" role="separator" aria-label={t("auth.google.or")}>
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
          {t("auth.google.or")}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-5">
        <GoogleSignInButton
          onSuccess={onSuccess}
          onError={onError}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default AuthGoogleSection;
