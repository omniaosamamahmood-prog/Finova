import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-start">
          <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {t("navigation.transactions")}
          </h2>
          <p className="mt-1 text-sm text-fg-muted sm:text-base">
            {t("transactions.subtitle")}
          </p>
        </div>

        <Button
          type="button"
          className="w-full sm:w-auto sm:px-5"
          onClick={openCreate}
        >
          <Plus className="size-4" aria-hidden />
          {t("transactions.add")}
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-fg-subtle" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("transactions.searchPlaceholder")}
            className="ps-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setTypeFilter(filter.key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                typeFilter === filter.key
                  ? "bg-primary-muted text-primary"
                  : "border border-border bg-surface text-fg-muted hover:bg-surface-hover hover:text-fg"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6">
        {isLoading && <TransactionSkeleton />}

        {isError && (
          <div className="rounded-2xl border border-danger/30 bg-danger-muted p-6 text-start">
            <p className="font-medium text-danger">
              {t(getErrorMessage(error), {
                defaultValue: getErrorMessage(error),
              })}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4 w-auto px-4"
              text={t("common.retry")}
              onClick={() => void refetch()}
            />
          </div>
        )}

        {!isLoading && !isError && filteredTransactions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-fg">
              {t("transactions.emptyTitle")}
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              {t("transactions.emptyDescription")}
            </p>
            <Button
              type="button"
              className="mx-auto mt-6 w-auto px-5"
              onClick={openCreate}
            >
              <Plus className="size-4" aria-hidden />
              {t("transactions.add")}
            </Button>
          </div>
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
