import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  budgetSchema,
  type BudgetFormData,
} from "../../validations/budget.validation";
import type { Budget, Category } from "../../types/api";
import { getCategoryLabel } from "../../utils/categoryLabel";

type BudgetFormProps = {
  categories: Category[];
  budgets: Budget[];
  initialValues?: Budget | null;
  isSubmitting?: boolean;
  onSubmit: (data: BudgetFormData) => void;
  onCancel: () => void;
};

function BudgetForm({
  categories,
  budgets,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: initialValues?.categoryId ?? "",
      amount: initialValues?.amount ?? 0,
    },
  });

  useEffect(() => {
    reset({
      categoryId: initialValues?.categoryId ?? "",
      amount: initialValues?.amount ?? 0,
    });
  }, [initialValues, reset]);

  const usedCategoryIds = useMemo(() => {
    const ids = new Set(budgets.map((budget) => budget.categoryId));
    if (initialValues?.categoryId) {
      ids.delete(initialValues.categoryId);
    }
    return ids;
  }, [budgets, initialValues?.categoryId]);

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === "EXPENSE"),
    [categories]
  );

  const availableCategories = useMemo(
    () =>
      expenseCategories.filter(
        (category) => !usedCategoryIds.has(category.id)
      ),
    [expenseCategories, usedCategoryIds]
  );

  const selectableCategories = isEditing
    ? expenseCategories.filter(
        (category) =>
          category.id === initialValues?.categoryId ||
          !usedCategoryIds.has(category.id)
      )
    : availableCategories;

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("budgets.form.category")}
        </label>
        <Select {...register("categoryId")} disabled={selectableCategories.length === 0}>
          <option value="">{t("budgets.form.categoryPlaceholder")}</option>
          {selectableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {getCategoryLabel(category.name, t)}
            </option>
          ))}
        </Select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.categoryId.message as string)}
          </p>
        )}
        {!isEditing && availableCategories.length === 0 && (
          <p className="mt-1 text-sm text-warning">
            {expenseCategories.length === 0
              ? t("budgets.form.noExpenseCategories")
              : t("budgets.form.allCategoriesUsed")}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("budgets.form.amount")}
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder={t("budgets.form.amountPlaceholder")}
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.amount.message as string)}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          text={t("common.cancel")}
          onClick={onCancel}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          text={
            isEditing ? t("budgets.form.save") : t("budgets.form.create")
          }
          isLoading={isSubmitting}
          disabled={!isEditing && availableCategories.length === 0}
        />
      </div>
    </form>
  );
}

export default BudgetForm;
