import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/ui/PageHeader";
import ErrorBanner from "../components/ui/ErrorBanner";
import { useToast } from "../components/ui/Toast";
import ProfileSection from "../components/settings/ProfileSection";
import SecuritySection from "../components/settings/SecuritySection";
import PreferencesSection from "../components/settings/PreferencesSection";
import PlanSection from "../components/settings/PlanSection";
import SettingsSkeleton from "../components/settings/SettingsSkeleton";
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
} from "../hooks/useProfile";
import { usePlan } from "../contexts/PlanContext";
import { getErrorMessage } from "../utils/errorMessage";
import type { ChangePasswordFormData } from "../validations/profile.validation";

function SettingsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const { data: profile, isLoading, isError, error, refetch } = useProfile();
  const updateMutation = useUpdateProfile();
  const passwordMutation = useChangePassword();
  const { plan, upgradeToPremium, isUpgrading } = usePlan();

  const handleProfileSave = async (payload: {
    fullName: string;
    avatar?: File;
    removeAvatar?: boolean;
  }) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync(payload);
      showToast(t("settings.toasts.profileUpdated"), "success");
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  const handlePasswordSave = async (data: ChangePasswordFormData) => {
    if (passwordMutation.isPending) return;

    try {
      await passwordMutation.mutateAsync(data);
      showToast(t("settings.toasts.passwordUpdated"), "success");
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
      throw err;
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("navigation.settings")}
        subtitle={t("settings.subtitle")}
      />

      <div className="mt-6 grid min-w-0 gap-5">
        {isLoading && <SettingsSkeleton />}

        {isError && (
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        )}

        {profile && (
          <>
          <section className="ui-card min-w-0 p-5 sm:p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-fg">
              {t("premium.settings.title")}
            </h3>
            <p className="mt-1 text-sm text-fg-muted">
              {t("premium.settings.subtitle")}
            </p>
            <div className="mt-6">
              <PlanSection
                plan={plan}
                isUpgrading={isUpgrading}
                onUpgrade={() => void upgradeToPremium()}
              />
            </div>
          </section>

          <section className="ui-card min-w-0 p-5 sm:p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-fg">
              {t("settings.tabs.profile")}
            </h3>
            <div className="mt-6">
              <ProfileSection
                profile={profile}
                isSaving={updateMutation.isPending}
                onSave={handleProfileSave}
                onValidationError={(key) => showToast(t(key), "error")}
              />
            </div>
          </section>
          </>
        )}

        <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:items-stretch">
          <section className="ui-card flex min-w-0 flex-col p-5 sm:p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-fg">
              {t("settings.tabs.security")}
            </h3>
            <p className="mt-1 text-sm text-fg-muted">
              {t("settings.security.subtitle")}
            </p>
            <div className="mt-6 flex-1">
              <SecuritySection
                isSaving={passwordMutation.isPending}
                onSubmit={handlePasswordSave}
              />
            </div>
          </section>

          <section className="ui-card flex min-w-0 flex-col p-5 sm:p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-fg">
              {t("settings.tabs.preferences")}
            </h3>
            <p className="mt-1 text-sm text-fg-muted">
              {t("settings.preferences.subtitle")}
            </p>
            <div className="mt-6 flex-1">
              <PreferencesSection />
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default SettingsPage;
