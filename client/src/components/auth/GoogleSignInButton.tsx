import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { getErrorMessage } from "../../utils/errorMessage";

type GoogleSignInButtonProps = {
  onSuccess?: () => void;
  onError?: (messageKey: string) => void;
  disabled?: boolean;
};

function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}: GoogleSignInButtonProps) {
  const { t, i18n } = useTranslation();
  const googleLogin = useGoogleLogin();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  const googleLocale = i18n.language.startsWith("ar") ? "ar" : "en";
  const isBusy = disabled || googleLogin.isPending;

  if (!clientId) {
    return (
      <p className="text-center text-sm text-fg-subtle">
        {t("auth.google.notConfigured")}
      </p>
    );
  }

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      onError?.("auth.google.invalidCredential");
      return;
    }

    try {
      await googleLogin.mutateAsync(response.credential);
      onSuccess?.();
    } catch (error) {
      const messageKey = getErrorMessage(error, "auth.google.failed");
      onError?.(messageKey);
    }
  };

  return (
    <div
      className={`relative w-full ${isBusy ? "pointer-events-none opacity-60" : ""}`}
      aria-busy={isBusy}
    >
      {/* Visible Finova label — always follows app i18n (EN/AR + RTL). */}
      <div
        className="pointer-events-none inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-fg"
        aria-hidden
      >
        <GoogleMark />
        <span>{t("auth.google.continue")}</span>
      </div>

      {/*
        Real Google button sits on top, invisible, so clicks still open GIS
        and return an ID token. Label above is what the user actually reads.
      */}
      <div className="absolute inset-0 z-10 overflow-hidden opacity-[0.001]">
        <div className="flex h-full w-full items-stretch justify-stretch [&>div]:h-full [&>div]:w-full [&>div>div]:h-full [&>div>div]:w-full">
          <GoogleLogin
            key={googleLocale}
            onSuccess={(credentialResponse) => {
              void handleSuccess(credentialResponse);
            }}
            onError={() => {
              onError?.("auth.google.failed");
            }}
            useOneTap={false}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            width="100%"
            {...{ locale: googleLocale }}
          />
        </div>
      </div>

      <span className="sr-only">{t("auth.google.continue")}</span>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default GoogleSignInButton;
