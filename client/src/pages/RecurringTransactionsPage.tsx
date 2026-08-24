import { useMemo, useState } from "react";
import { Plus, Repeat } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import RecurringTransactionCard from "../components/recurring-transactions/RecurringTransactionCard";
import RecurringTransactionModal from "../components/recurring-transactions/RecurringTransactionModal";
import DeleteRecurringTransactionDialog from "../components/recurring-transactions/DeleteRecurringTransactionDialog";
import RecurringTransactionSkeleton from "../components/recurring-transactions/RecurringTransactionSkeleton";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorBanner from "../components/ui/ErrorBanner";
import FilterChip from "../components/ui/FilterChip";
import { useToast } from "../components/ui/Toast";
import { useCategories } from "../hooks/useCategories";
import {
  useCreateRecurringTransaction,
  useDeleteRecurringTransaction,
  useRecurringTransactions,
  useToggleRecurringTransaction,
  useUpdateRecurringTransaction,
} from "../hooks/useRecurringTransactions";
import type { RecurringTransaction } from "../types/api";
import type { RecurringTransactionFormData } from "../validations/recurringTransaction.validation";
import { getErrorMessage } from "../utils/errorMessage";

type StatusFilter = "ALL" | "ACTIVE" | "PAUSED";

function toPayload(data: RecurringTransactionFormData) {
  return {
    title: data.title.trim(),
    amount: data.amount,
    type: data.type,
    frequency: data.frequency,
    categoryId: data.categoryId,
    startDate: data.startDate,
    isActive: data.isActive,
  };
}

function RecurringTransactionsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useRecurringTransactions();
  const { data: categories = [] } = useCategories();

  const createMutation = useCreateRecurringTransaction();
  const updateMutation = useUpdateRecurringTransaction();
  const deleteMutation = useDeleteRecurringTransaction();
  const toggleMutation = useToggleRecurringTransaction();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringTransaction | null>(null);
  const [deleting, setDeleting] = useState<RecurringTransaction | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter === "ACTIVE") return item.isActive;
      if (statusFilter === "PAUSED") return !item.isActive;
      return true;
    });
  }, [items, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: RecurringTransaction) => {
    setEditing(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: RecurringTransactionFormData) => {
    const payload = toPayload(data);

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload });
        showToast(t("recurring.toasts.updated"), "success");
      } else {
        await createMutation.mutateAsync(payload);
        showToast(t("recurring.toasts.created"), "success");
      }
      closeModal();
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  const handleToggle = async (item: RecurringTransaction) => {
    try {
      await toggleMutation.mutateAsync({
        id: item.id,
        isActive: !item.isActive,
      });
      showToast(
        item.isActive
          ? t("recurring.toasts.paused")
          : t("recurring.toasts.resumed"),
        "success"
      );
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      await deleteMutation.mutateAsync(deleting.id);
      showToast(t("recurring.toasts.deleted"), "success");
      setDeleting(null);
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={t("navigation.recurring")}
        subtitle={t("recurring.subtitle")}
        action={
          <Button
            type="button"
            className="w-full sm:w-auto sm:px-5"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden />
            {t("recurring.add")}
          </Button>
        }
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {(["ALL", "ACTIVE", "PAUSED"] as const).map((filter) => (
          <FilterChip
            key={filter}
            active={statusFilter === filter}
            onClick={() => setStatusFilter(filter)}
          >
            {t(`recurring.filters.${filter}`)}
          </FilterChip>
        ))}
      </div>

      <section className="mt-6">
        {isLoading && <RecurringTransactionSkeleton />}

        {isError && (
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && items.length === 0 && (
          <EmptyState
            icon={Repeat}
            title={t("recurring.emptyTitle")}
            description={t("recurring.emptyDescription")}
            action={
              <Button
                type="button"
                className="w-auto px-5"
                onClick={openCreate}
              >
                <Plus className="size-4" aria-hidden />
                {t("recurring.add")}
              </Button>
            }
          />
        )}

        {!isLoading &&
          !isError &&
          items.length > 0 &&
          filteredItems.length === 0 && (
            <EmptyState
              icon={Repeat}
              title={t("recurring.emptyFilterTitle")}
              description={t("recurring.emptyFilterDescription")}
            />
          )}

        {!isLoading && !isError && filteredItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredItems.map((item) => (
              <RecurringTransactionCard
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={setDeleting}
                onToggle={(current) => void handleToggle(current)}
                isToggling={
                  toggleMutation.isPending &&
                  toggleMutation.variables?.id === item.id
                }
              />
            ))}
          </div>
        )}
      </section>

      <RecurringTransactionModal
        open={modalOpen}
        item={editing}
        categories={categories}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={closeModal}
        onSubmit={(data) => void handleSubmit(data)}
      />

      <DeleteRecurringTransactionDialog
        open={Boolean(deleting)}
        item={deleting}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => void handleDelete()}
      />
    </AppLayout>
  );
}

export default RecurringTransactionsPage;
