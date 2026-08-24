import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetModal from "../components/budgets/BudgetModal";
import DeleteBudgetDialog from "../components/budgets/DeleteBudgetDialog";
import BudgetSkeleton from "../components/budgets/BudgetSkeleton";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorBanner from "../components/ui/ErrorBanner";
import { useToast } from "../components/ui/Toast";
import { useCategories } from "../hooks/useCategories";
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from "../hooks/useBudgets";
import type { Budget } from "../types/api";
import type { BudgetFormData } from "../validations/budget.validation";
import { getErrorMessage } from "../utils/errorMessage";

function BudgetsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const {
    data: budgets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useBudgets();
  const { data: categories = [] } = useCategories();

  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState<Budget | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (budget: Budget) => {
    setEditing(budget);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: BudgetFormData) => {
    const payload = {
      amount: data.amount,
      categoryId: data.categoryId,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload });
        showToast(t("budgets.toasts.updated"), "success");
      } else {
        await createMutation.mutateAsync(payload);
        showToast(t("budgets.toasts.created"), "success");
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
      showToast(t("budgets.toasts.deleted"), "success");
      setDeleting(null);
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("navigation.budgets")}
        subtitle={t("budgets.subtitle")}
        action={
          <Button
            type="button"
            className="w-full sm:w-auto sm:px-5"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden />
            {t("budgets.add")}
          </Button>
        }
      />

      <section className="mt-6">
        {isLoading && <BudgetSkeleton />}

        {isError && (
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && budgets.length === 0 && (
          <EmptyState
            icon={Wallet}
            title={t("budgets.emptyTitle")}
            description={t("budgets.emptyDescription")}
            action={
              <Button
                type="button"
                className="w-auto px-5"
                onClick={openCreate}
              >
                <Plus className="size-4" aria-hidden />
                {t("budgets.add")}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && budgets.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </div>
        )}
      </section>

      <BudgetModal
        open={modalOpen}
        budget={editing}
        categories={categories}
        budgets={budgets}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <DeleteBudgetDialog
        open={Boolean(deleting)}
        budget={deleting}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => void handleDelete()}
      />
    </AppLayout>
  );
}

export default BudgetsPage;
