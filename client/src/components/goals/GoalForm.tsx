import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  goalSchema,
  type GoalFormData,
} from "../../validations/goal.validation";
import type { Goal } from "../../types/api";
import { toOptionalDateInputValue } from "../../utils/goalProgress";

type GoalFormProps = {
  initialValues?: Goal | null;
  isSubmitting?: boolean;
  onSubmit: (data: GoalFormData) => void;
  onCancel: () => void;
};

function GoalForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: GoalFormProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialValues);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      targetAmount: initialValues?.targetAmount ?? 0,
      currentAmount: initialValues?.currentAmount ?? 0,
      targetDate: toOptionalDateInputValue(initialValues?.targetDate),
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name ?? "",
      targetAmount: initialValues?.targetAmount ?? 0,
      currentAmount: initialValues?.currentAmount ?? 0,
      targetDate: toOptionalDateInputValue(initialValues?.targetDate),
    });
  }, [initialValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("goals.form.name")}
        </label>
        <Input
          placeholder={t("goals.form.namePlaceholder")}
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
          {t("goals.form.targetAmount")}
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder={t("goals.form.targetAmountPlaceholder")}
          {...register("targetAmount", { valueAsNumber: true })}
        />
        {errors.targetAmount && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.targetAmount.message as string)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("goals.form.currentAmount")}
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder={t("goals.form.currentAmountPlaceholder")}
          {...register("currentAmount", { valueAsNumber: true })}
        />
        {errors.currentAmount && (
          <p className="mt-1 text-sm text-danger">
            {t(errors.currentAmount.message as string)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-fg-muted">
          {t("goals.form.targetDate")}
        </label>
        <Input type="date" {...register("targetDate")} />
        <p className="mt-1 text-xs text-fg-subtle">
          {t("goals.form.targetDateHint")}
        </p>
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
          text={isEditing ? t("goals.form.save") : t("goals.form.create")}
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}

export default GoalForm;
