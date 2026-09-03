import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import GoalCard from "../components/goals/GoalCard";
import GoalModal from "../components/goals/GoalModal";
import DeleteGoalDialog from "../components/goals/DeleteGoalDialog";
import GoalSkeleton from "../components/goals/GoalSkeleton";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorBanner from "../components/ui/ErrorBanner";
import { useToast } from "../components/ui/Toast";
import {
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useUpdateGoal,
} from "../hooks/useGoals";
import type { Goal } from "../types/api";
import type { GoalFormData } from "../validations/goal.validation";
import { getErrorMessage } from "../utils/errorMessage";
import { usePlan } from "../contexts/PlanContext";
import UpgradeToPremiumPanel from "../components/premium/UpgradeToPremiumPanel";

function toGoalPayload(data: GoalFormData) {
  return {
    name: data.name.trim(),
    targetAmount: data.targetAmount,
    currentAmount: Number.isFinite(data.currentAmount) ? data.currentAmount : 0,
    targetDate: data.targetDate?.trim() ? data.targetDate : null,
  };
}

function GoalsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { isPremium, isPlanReady, upgradeToPremium, isUpgrading } = usePlan();

  const {
    data: goals = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGoals();

  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const deleteMutation = useDeleteGoal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [deleting, setDeleting] = useState<Goal | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: GoalFormData) => {
    const payload = toGoalPayload(data);

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload });
        showToast(t("goals.toasts.updated"), "success");
      } else {
        await createMutation.mutateAsync(payload);
        showToast(t("goals.toasts.created"), "success");
      }
      closeModal();
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      await deleteMutation.mutateAsync(deleting.id);
      showToast(t("goals.toasts.deleted"), "success");
      setDeleting(null);
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("navigation.goals")}
        subtitle={t("goals.subtitle")}
        action={
          isPremium ? (
          <Button
            type="button"
            className="w-full sm:w-auto sm:px-5"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden />
            {t("goals.add")}
          </Button>
          ) : undefined
        }
      />

      {!isPlanReady ? (
        <section className="mt-6">
          <GoalSkeleton />
        </section>
      ) : !isPremium ? (
        <section className="ui-card mt-6 p-5 sm:p-8">
          <UpgradeToPremiumPanel
            feature="goals"
            isUpgrading={isUpgrading}
            onUpgrade={() => void upgradeToPremium()}
          />
        </section>
      ) : (
      <section className="mt-6">
        {isLoading && <GoalSkeleton />}

        {isError && (
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && goals.length === 0 && (
          <EmptyState
            icon={Target}
            title={t("goals.emptyTitle")}
            description={t("goals.emptyDescription")}
            action={
              <Button
                type="button"
                className="w-auto px-5"
                onClick={openCreate}
              >
                <Plus className="size-4" aria-hidden />
                {t("goals.add")}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && goals.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </div>
        )}
      </section>
      )}

      <GoalModal
        open={modalOpen}
        goal={editing}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <DeleteGoalDialog
        open={Boolean(deleting)}
        goal={deleting}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => void handleDelete()}
      />
    </AppLayout>
  );
}

export default GoalsPage;
