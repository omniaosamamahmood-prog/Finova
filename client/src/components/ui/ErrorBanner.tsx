import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { getErrorMessage } from "../../utils/errorMessage";

type ErrorBannerProps = {
  error: unknown;
  onRetry?: () => void;
};

function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  const { t } = useTranslation();
  const messageKey = getErrorMessage(error);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-danger/25 bg-danger-muted px-5 py-4 text-start sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
        <p className="font-medium text-danger">
          {t(messageKey, { defaultValue: messageKey })}
        </p>
      </div>
      {onRetry && (
        <Button
          type="button"
          variant="secondary"
          className="w-auto px-4"
          text={t("common.retry")}
          onClick={onRetry}
        />
      )}
    </div>
  );
}

export default ErrorBanner;
