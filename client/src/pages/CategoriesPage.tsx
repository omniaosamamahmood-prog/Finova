import { useMemo, useState } from "react";
import { Plus, Search, Tags } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";
import CategoryCard from "../components/categories/CategoryCard";
import CategoryModal from "../components/categories/CategoryModal";
import DeleteCategoryDialog from "../components/categories/DeleteCategoryDialog";
import CategorySkeleton from "../components/categories/CategorySkeleton";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorBanner from "../components/ui/ErrorBanner";
import FilterChip from "../components/ui/FilterChip";
import { useToast } from "../components/ui/Toast";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks/useCategories";
import { useBudgets } from "../hooks/useBudgets";
import { useTransactions } from "../hooks/useTransactions";
import type { Category, TransactionType } from "../types/api";
import type { CategoryFormData } from "../validations/category.validation";
import { getErrorMessage } from "../utils/errorMessage";
import { getCategoryLabel } from "../utils/categoryLabel";

type TypeFilter = "ALL" | TransactionType;

function getDeleteBlock(
  category: Category | null,
  transactionCategoryIds: Set<string>,
  budgetCategoryIds: Set<string>
) {
  if (!category) return null;
  if (transactionCategoryIds.has(category.id)) return "transactions" as const;
  if (budgetCategoryIds.has(category.id)) return "budget" as const;
  return null;
}

function CategoriesPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories();
  const { data: transactions = [] } = useTransactions();
  const { data: budgets = [] } = useBudgets();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const transactionCategoryIds = useMemo(
    () => new Set(transactions.map((item) => item.categoryId)),
    [transactions]
  );
  const budgetCategoryIds = useMemo(
    () => new Set(budgets.map((item) => item.categoryId)),
    [budgets]
  );

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesType = typeFilter === "ALL" || category.type === typeFilter;
      const label = getCategoryLabel(category.name, t).toLowerCase();
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        label.includes(query);

      return matchesType && matchesSearch;
    });
  }, [categories, typeFilter, search, t]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    const payload = {
      name: data.name.trim(),
      type: data.type,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload });
        showToast(t("categories.toasts.updated"), "success");
      } else {
        await createMutation.mutateAsync(payload);
        showToast(t("categories.toasts.created"), "success");
      }
      closeModal();
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    if (getDeleteBlock(deleting, transactionCategoryIds, budgetCategoryIds)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleting.id);
      showToast(t("categories.toasts.deleted"), "success");
      setDeleting(null);
    } catch (err) {
      const messageKey = getErrorMessage(err);
      showToast(t(messageKey, { defaultValue: messageKey }), "error");
    }
  };

  const filters: { key: TypeFilter; label: string }[] = [
    { key: "ALL", label: t("categories.filters.all") },
    { key: "INCOME", label: t("categories.filters.income") },
    { key: "EXPENSE", label: t("categories.filters.expense") },
  ];

  const emptyFromFilter =
    !isLoading &&
    !isError &&
    categories.length > 0 &&
    filteredCategories.length === 0;

  return (
    <AppLayout>
      <PageHeader
        title={t("navigation.categories")}
        subtitle={t("categories.subtitle")}
        action={
          <Button
            type="button"
            className="w-full sm:w-auto sm:px-5"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden />
            {t("categories.add")}
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-3.5 size-4 -translate-y-1/2 text-fg-subtle" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("categories.searchPlaceholder")}
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
        {isLoading && <CategorySkeleton />}

        {isError && (
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && categories.length === 0 && (
          <EmptyState
            icon={Tags}
            title={t("categories.emptyTitle")}
            description={t("categories.emptyDescription")}
            action={
              <Button
                type="button"
                className="w-auto px-5"
                onClick={openCreate}
              >
                <Plus className="size-4" aria-hidden />
                {t("categories.add")}
              </Button>
            }
          />
        )}

        {emptyFromFilter && (
          <EmptyState
            icon={Search}
            title={t("categories.emptyFilterTitle")}
            description={t("categories.emptyFilterDescription")}
          />
        )}

        {!isLoading && !isError && filteredCategories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </div>
        )}
      </section>

      <CategoryModal
        open={modalOpen}
        category={editing}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <DeleteCategoryDialog
        open={Boolean(deleting)}
        category={deleting}
        blockedBy={getDeleteBlock(
          deleting,
          transactionCategoryIds,
          budgetCategoryIds
        )}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => void handleDelete()}
      />
    </AppLayout>
  );
}

export default CategoriesPage;
