import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MessageSquareHeart,
  ShieldOff,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import axios from "axios";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/ui/PageHeader";
import SummaryCard from "../components/dashboard/SummaryCard";
import FilterChip from "../components/ui/FilterChip";
import ErrorBanner from "../components/ui/ErrorBanner";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import {
  useAdminFeedback,
  useAdminOverview,
  useAdminUsers,
  useUpdateAdminUserPlan,
} from "../hooks/useAdmin";
import { FEEDBACK_TYPES } from "../types/feedback";
import { formatDate } from "../utils/format";
import PlanBadge from "../components/premium/PlanBadge";
import type { AdminFeedbackItem, AdminUser } from "../types/admin";

type AdminTab = "dashboard" | "users" | "feedback";

function isForbidden(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 403;
}

function AdminAccessDenied() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg">
          <EmptyState
            icon={ShieldOff}
            title={t("admin.accessDenied.title")}
            description={t("admin.accessDenied.body")}
            action={
              <Link to="/dashboard">
                <Button
                  type="button"
                  className="!w-auto px-5"
                  text={t("admin.accessDenied.goDashboard")}
                />
              </Link>
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}

function AdminUsersTable({ users }: { users: AdminUser[] }) {
  const { t, i18n } = useTranslation();
  const updatePlan = useUpdateAdminUserPlan();

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t("admin.users.empty")}
        description={t("admin.users.emptyDescription")}
      />
    );
  }

  return (
    <div className="ui-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-start text-sm">
          <thead className="border-b border-border bg-surface text-fg-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">{t("admin.users.name")}</th>
              <th className="px-4 py-3 font-semibold">{t("admin.users.email")}</th>
              <th className="px-4 py-3 font-semibold">{t("admin.users.verified")}</th>
              <th className="px-4 py-3 font-semibold">{t("admin.users.google")}</th>
              <th className="px-4 py-3 font-semibold">{t("admin.users.plan")}</th>
              <th className="px-4 py-3 font-semibold">{t("admin.users.joined")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-fg">{user.fullName}</td>
                <td className="px-4 py-3 text-fg-muted">{user.email}</td>
                <td className="px-4 py-3 text-fg-muted">
                  {user.emailVerified ? t("admin.users.yes") : t("admin.users.no")}
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  {user.hasGoogle ? t("admin.users.yes") : t("admin.users.no")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <PlanBadge plan={user.plan ?? "FREE"} />
                    <button
                      type="button"
                      disabled={updatePlan.isPending}
                      onClick={() =>
                        updatePlan.mutate({
                          id: user.id,
                          plan: user.plan === "PREMIUM" ? "FREE" : "PREMIUM",
                        })
                      }
                      className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      {user.plan === "PREMIUM"
                        ? t("admin.users.setFree")
                        : t("admin.users.setPremium")}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  {formatDate(user.createdAt, i18n.language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminFeedbackList({ items }: { items: AdminFeedbackItem[] }) {
  const { t, i18n } = useTranslation();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareHeart}
        title={t("admin.feedback.empty")}
        description={t("admin.feedback.emptyDescription")}
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="ui-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-fg">{item.user.fullName}</p>
              <p className="text-sm text-fg-muted">{item.user.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-muted px-2.5 py-1 font-medium text-primary">
                <Star className="size-3.5 fill-primary" aria-hidden />
                {item.rating}
              </span>
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-fg-muted">
                {t(`feedback.types.${item.type}`)}
              </span>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg">
            {item.message}
          </p>
          {item.featureRequest && (
            <p className="mt-2 text-sm text-fg-muted">
              <span className="font-medium text-fg">
                {t("admin.feedback.featureRequest")}:
              </span>{" "}
              {item.featureRequest}
            </p>
          )}
          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-subtle">
            {item.page && (
              <div>
                <dt className="inline">{t("admin.feedback.page")}: </dt>
                <dd className="inline">{item.page}</dd>
              </div>
            )}
            {item.browser && (
              <div>
                <dt className="inline">{t("admin.feedback.browser")}: </dt>
                <dd className="inline">{item.browser}</dd>
              </div>
            )}
            <div>
              <dt className="inline">{t("admin.feedback.date")}: </dt>
              <dd className="inline">{formatDate(item.createdAt, i18n.language)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

function AdminPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<AdminTab>("dashboard");

  const overviewQuery = useAdminOverview(true);
  const usersQuery = useAdminUsers(true);
  const feedbackQuery = useAdminFeedback(true);

  const forbidden =
    isForbidden(overviewQuery.error) ||
    isForbidden(usersQuery.error) ||
    isForbidden(feedbackQuery.error);

  if (forbidden) {
    return <AdminAccessDenied />;
  }

  const tabs: AdminTab[] = ["dashboard", "users", "feedback"];
  const isLoading =
    overviewQuery.isLoading || usersQuery.isLoading || feedbackQuery.isLoading;
  const error =
    overviewQuery.error || usersQuery.error || feedbackQuery.error;

  return (
    <AppLayout>
      <PageHeader
        title={t("navigation.adminPlatform")}
        subtitle={t("admin.subtitle")}
      />

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label={t("navigation.adminPlatform")}
      >
        {tabs.map((item) => (
          <FilterChip
            key={item}
            active={tab === item}
            onClick={() => setTab(item)}
          >
            {t(`admin.tabs.${item}`)}
          </FilterChip>
        ))}
      </div>

      <div className="mt-6">
        {error && (
          <ErrorBanner
            error={error}
            onRetry={() => {
              void overviewQuery.refetch();
              void usersQuery.refetch();
              void feedbackQuery.refetch();
            }}
          />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-border bg-surface"
              />
            ))}
          </div>
        ) : (
          <>
            {tab === "dashboard" && overviewQuery.data && (
              <section className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <SummaryCard
                    title={t("admin.stats.users")}
                    value={`${overviewQuery.data.usersCount}`}
                    icon={Users}
                    tone="primary"
                  />
                  <SummaryCard
                    title={t("admin.stats.verified")}
                    value={`${overviewQuery.data.verifiedUsersCount}`}
                    icon={UserCheck}
                    tone="success"
                  />
                  <SummaryCard
                    title={t("admin.stats.feedback")}
                    value={`${overviewQuery.data.feedbackCount}`}
                    icon={MessageSquareHeart}
                  />
                  <SummaryCard
                    title={t("admin.stats.averageRating")}
                    value={overviewQuery.data.averageRating.toFixed(1)}
                    icon={Star}
                  />
                </div>

                <div className="ui-card p-5 sm:p-6">
                  <h3 className="text-base font-semibold text-fg">
                    {t("admin.stats.feedbackByType")}
                  </h3>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {FEEDBACK_TYPES.map((type) => (
                      <li
                        key={type}
                        className="rounded-xl border border-border bg-surface px-3 py-3"
                      >
                        <p className="text-xs font-medium text-fg-muted">
                          {t(`feedback.types.${type}`)}
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums text-fg">
                          {overviewQuery.data?.feedbackByType[type] ?? 0}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {tab === "users" && usersQuery.data && (
              <AdminUsersTable users={usersQuery.data} />
            )}

            {tab === "feedback" && feedbackQuery.data && (
              <AdminFeedbackList items={feedbackQuery.data} />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default AdminPage;
