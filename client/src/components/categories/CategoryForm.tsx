import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  categorySchema,
  type CategoryFormData,
} from "../../validations/category.validation";
import type { Category } from "../../types/api";

type CategoryFormProps = {
  initialValues?: Category | null;
  isSubmitting?: boolean;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
};

function CategoryForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      type: initialValues?.type ?? "EXPENSE",
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name ?? "",
      type: initialValues?.type ?? "EXPENSE",
    });
  }, [initialValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("categories.form.name")}
        </label>
        <Input
          placeholder={t("categories.form.namePlaceholder")}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.name.message as string)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("categories.form.type")}
        </label>
        <Select {...register("type")}>
          <option value="INCOME">{t("categories.types.INCOME")}</option>
          <option value="EXPENSE">{t("categories.types.EXPENSE")}</option>
        </Select>
        {errors.type && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.type.message as string)}
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
            isEditing ? t("categories.form.save") : t("categories.form.create")
          }
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}

export default CategoryForm;
