import { useMemo, useState } from "react";
import { Plus, Receipt, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import TransactionCard, {
  resolveCategoryKey,
} from "../components/transactions/TransactionCard";
import TransactionModal from "../components/transactions/TransactionModal";
import DeleteTransactionDialog from "../components/transactions/DeleteTransactionDialog";
import TransactionSkeleton from "../components/transactions/TransactionSkeleton";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorBanner from "../components/ui/ErrorBanner";
import FilterChip from "../components/ui/FilterChip";
import { useToast } from "../components/ui/Toast";
import { useCategories } from "../hooks/useCategories";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "../hooks/useTransactions";
import type { Transaction, TransactionType } from "../types/api";
import type { TransactionFormData } from "../validations/transaction.validation";
import { getErrorMessage } from "../utils/errorMessage";
import { getCategoryLabel } from "../utils/categoryLabel";

type TypeFilter = "ALL" | TransactionType;

function TransactionsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactions();
  const { data: categories = [] } = useCategories();

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "ALL" || transaction.type === typeFilter;
      const categoryKey = resolveCategoryKey(transaction, categories);
      const categoryLabel = categoryKey
        ? getCategoryLabel(categoryKey, t).toLowerCase()
        : "";
      const categoryKeyLower = categoryKey?.toLowerCase() ?? "";
      const matchesSearch =
        !query ||
        transaction.title.toLowerCase().includes(query) ||
        categoryLabel.includes(query) ||
        categoryKeyLower.includes(query);

      return matchesType && matchesSearch;
    });
  }, [transactions, typeFilter, search, categories, t]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: TransactionFormData) => {
    const payload = {
      title: data.title,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      transactionDate: new Date(data.transactionDate).toISOString(),
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload });
        showToast(t("transactions.toasts.updated"), "success");
      } else {
        await createMutation.mutateAsync(payload);
        showToast(t("transactions.toasts.created"), "success");
      }
      closeModal();
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(
        t(messageKey, { defaultValue: messageKey }),
        "error"
      );
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      await deleteMutation.mutateAsync(deleting.id);
      showToast(t("transactions.toasts.deleted"), "success");
      setDeleting(null);
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(
        t(messageKey, { defaultValue: messageKey }),
        "error"
      );
    }
  };

  const filters: { key: TypeFilter; label: string }[] = [
    { key: "ALL", label: t("transactions.filters.all") },
    { key: "INCOME", label: t("transactions.filters.income") },
    { key: "EXPENSE", label: t("transactions.filters.expense") },
  ];

  return (
    <AppLayout>
      <PageHeader
        title={t("navigation.transactions")}
        subtitle={t("transactions.subtitle")}
        action={
          <Button
            type="button"
            className="w-full sm:w-auto sm:px-5"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden />
            {t("transactions.add")}
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3.5 size-4 -translate-y-1/2 text-fg-subtle" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("transactions.searchPlaceholder")}
            className="ps-11"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterChip
              key={filter.key}
              active={typeFilter === filter.key}
              onClick={() => setTypeFilter(filter.key)}
            >
              {filter.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <section className="mt-6">
        {isLoading && <TransactionSkeleton />}

        {isError && (
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && filteredTransactions.length === 0 && (
          <EmptyState
            icon={Receipt}
            title={t("transactions.emptyTitle")}
            description={t("transactions.emptyDescription")}
            action={
              <Button
                type="button"
                className="w-auto px-5"
                onClick={openCreate}
              >
                <Plus className="size-4" aria-hidden />
                {t("transactions.add")}
              </Button>
            }
          />
        )}

        {!isLoading && !isError && filteredTransactions.length > 0 && (
          <div className="grid gap-4">
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                categoryKey={resolveCategoryKey(transaction, categories)}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </div>
        )}
      </section>

      <TransactionModal
        open={modalOpen}
        transaction={editing}
        categories={categories}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <DeleteTransactionDialog
        open={Boolean(deleting)}
        transaction={deleting}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => void handleDelete()}
      />
    </AppLayout>
  );
}

export default TransactionsPage;
