import { useTranslation } from "react-i18next";
import { MessageCircleHeart } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import FeedbackDialog from "../feedback/FeedbackDialog";
import Button from "../ui/Button";
import { useFeedbackDialog } from "../../hooks/useFeedbackDialog";

function PreferencesSection() {
  const { t } = useTranslation();
  const { open, openDialog, closeDialog, isSubmitting, submit } =
    useFeedbackDialog();

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex min-w-0 flex-1 flex-col justify-center rounded-2xl border border-border-subtle bg-bg p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 text-start">
            <p className="text-sm font-medium text-fg">
              {t("settings.preferences.language")}
            </p>
            <p className="mt-1 text-sm text-fg-subtle">
              {t("settings.preferences.languageHint")}
            </p>
          </div>
          <LanguageSwitcher className="w-full shrink-0 sm:w-auto sm:min-w-56" />
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-bg p-5 md:hidden sm:p-6">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0 text-start">
            <p className="text-sm font-medium text-fg">
              {t("settings.preferences.feedback")}
            </p>
            <p className="mt-1 text-sm text-fg-subtle">
              {t("settings.preferences.feedbackHint")}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={openDialog}
          >
            <MessageCircleHeart className="size-4 text-primary" aria-hidden />
            {t("feedback.button")}
          </Button>
        </div>
      </div>

      <FeedbackDialog
        open={open}
        isSubmitting={isSubmitting}
        onClose={closeDialog}
        onSubmit={(data) => {
          void submit(data);
        }}
      />
    </div>
  );
}

export default PreferencesSection;
