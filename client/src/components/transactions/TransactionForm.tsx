import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  transactionSchema,
  type TransactionFormData,
} from "../../validations/transaction.validation";
import type { Category, Transaction } from "../../types/api";
import { toDateInputValue } from "../../utils/format";
import { getCategoryLabel } from "../../utils/categoryLabel";

type TransactionFormProps = {
  categories: Category[];
  initialValues?: Transaction | null;
  isSubmitting?: boolean;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
};

function TransactionForm({
  categories,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      amount: initialValues?.amount ?? 0,
      type: initialValues?.type ?? "EXPENSE",
      categoryId: initialValues?.categoryId ?? "",
      transactionDate: toDateInputValue(initialValues?.transactionDate),
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
      transactionDate: toDateInputValue(initialValues?.transactionDate),
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
          {t("transactions.form.title")}
        </label>
        <Input
          placeholder={t("transactions.form.titlePlaceholder")}
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
          {t("transactions.form.amount")}
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder={t("transactions.form.amountPlaceholder")}
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
          {t("transactions.form.type")}
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
          {t("transactions.form.category")}
        </label>
        <Select {...register("categoryId")}>
          <option value="">{t("transactions.form.categoryPlaceholder")}</option>
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
            {t("transactions.form.noCategories")}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("transactions.form.date")}
        </label>
        <Input type="date" {...register("transactionDate")} />
        {errors.transactionDate && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.transactionDate.message as string)}
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
            initialValues
              ? t("transactions.form.save")
              : t("transactions.form.create")
          }
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}

export default TransactionForm;
