import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  recurringTransactionSchema,
  type RecurringTransactionFormData,
} from "../../validations/recurringTransaction.validation";
import type { Category, RecurringTransaction } from "../../types/api";
import { toDateInputValue } from "../../utils/format";
import { getCategoryLabel } from "../../utils/categoryLabel";

type RecurringTransactionFormProps = {
  categories: Category[];
  initialValues?: RecurringTransaction | null;
  isSubmitting?: boolean;
  onSubmit: (data: RecurringTransactionFormData) => void;
  onCancel: () => void;
};

function RecurringTransactionForm({
  categories,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: RecurringTransactionFormProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RecurringTransactionFormData>({
    resolver: zodResolver(recurringTransactionSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      amount: initialValues?.amount ?? 0,
      type: initialValues?.type ?? "EXPENSE",
      categoryId: initialValues?.categoryId ?? "",
      frequency: initialValues?.frequency ?? "MONTHLY",
      startDate: toDateInputValue(initialValues?.startDate),
      isActive: initialValues?.isActive ?? true,
    },
  });

  const selectedType = watch("type");
  const selectedCategoryId = watch("categoryId");

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === selectedType),
    [categories, selectedType]
  );

  useEffect(() => {
    reset({
      title: initialValues?.title ?? "",
      amount: initialValues?.amount ?? 0,
      type: initialValues?.type ?? "EXPENSE",
      categoryId: initialValues?.categoryId ?? "",
      frequency: initialValues?.frequency ?? "MONTHLY",
      startDate: toDateInputValue(initialValues?.startDate),
      isActive: initialValues?.isActive ?? true,
    });
  }, [initialValues, reset]);

  useEffect(() => {
    const stillValid = filteredCategories.some(
      (category) => category.id === selectedCategoryId
    );
    if (!stillValid && selectedCategoryId) {
      setValue("categoryId", "");
    }
  }, [filteredCategories, selectedCategoryId, setValue]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("recurring.form.title")}
        </label>
        <Input
          placeholder={t("recurring.form.titlePlaceholder")}
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.title.message as string)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("recurring.form.amount")}
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder={t("recurring.form.amountPlaceholder")}
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.amount.message as string)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("recurring.form.type")}
        </label>
        <Select {...register("type")}>
          <option value="INCOME">{t("transactions.types.INCOME")}</option>
          <option value="EXPENSE">{t("transactions.types.EXPENSE")}</option>
        </Select>
        {errors.type && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.type.message as string)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("recurring.form.category")}
        </label>
        <Select {...register("categoryId")}>
          <option value="">{t("recurring.form.categoryPlaceholder")}</option>
          {filteredCategories.map((category) => (
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
        {filteredCategories.length === 0 && (
          <p className="mt-1 text-sm text-warning">
            {t("recurring.form.noCategories")}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("recurring.form.frequency")}
        </label>
        <Select {...register("frequency")}>
          <option value="DAILY">{t("recurring.frequency.DAILY")}</option>
          <option value="WEEKLY">{t("recurring.frequency.WEEKLY")}</option>
          <option value="MONTHLY">{t("recurring.frequency.MONTHLY")}</option>
          <option value="YEARLY">{t("recurring.frequency.YEARLY")}</option>
        </Select>
        {errors.frequency && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.frequency.message as string)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("recurring.form.startDate")}
        </label>
        <Input type="date" {...register("startDate")} />
        {errors.startDate && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.startDate.message as string)}
          </p>
        )}
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          {...register("isActive")}
        />
        <span>{t("recurring.form.active")}</span>
      </label>

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
            isEditing ? t("recurring.form.save") : t("recurring.form.create")
          }
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}

export default RecurringTransactionForm;
