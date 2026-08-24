import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import Select from "../ui/Select";
import RatingStars from "./RatingStars";
import {
  feedbackSchema,
  type FeedbackFormData,
} from "../../validations/feedback.validation";
import { FEEDBACK_TYPES } from "../../types/feedback";

type FeedbackDialogProps = {
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackFormData) => void;
};

function FeedbackDialog({
  open,
  isSubmitting = false,
  onClose,
  onSubmit,
}: FeedbackDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      type: "GENERAL",
      message: "",
      featureRequest: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      rating: 0,
      type: "GENERAL",
      message: "",
      featureRequest: "",
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
        className="enter enter-up relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-border bg-bg-elevated shadow-card sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <Heart className="size-3.5 fill-primary" aria-hidden />
              {t("feedback.kicker")}
            </p>
            <h2
              id="feedback-dialog-title"
              className="text-lg font-semibold text-fg"
            >
              {t("feedback.dialogTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-fg-muted transition hover:bg-surface hover:text-fg"
          >
            <X className="size-5" aria-hidden />
            <span className="sr-only">{t("common.close")}</span>
          </button>
        </div>

        <form
          className="space-y-4 overflow-y-auto px-5 py-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-muted">
              {t("feedback.rating")}
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <RatingStars
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-danger">
                {t(errors.rating.message as string)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="feedback-type"
              className="mb-1.5 block text-sm font-medium text-fg-muted"
            >
              {t("feedback.category")}
            </label>
            <Select id="feedback-type" disabled={isSubmitting} {...register("type")}>
              {FEEDBACK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`feedback.types.${type}`)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label
              htmlFor="feedback-message"
              className="mb-1.5 block text-sm font-medium text-fg-muted"
            >
              {t("feedback.message")}
            </label>
            <textarea
              id="feedback-message"
              rows={4}
              maxLength={1000}
              placeholder={t("feedback.messagePlaceholder")}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle outline-none transition hover:border-primary/30 focus:border-primary focus:bg-surface focus:shadow-[var(--app-ring-focus)] disabled:cursor-not-allowed disabled:opacity-60"
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-danger">
                {t(errors.message.message as string)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="feedback-feature"
              className="mb-1.5 block text-sm font-medium text-fg-muted"
            >
              {t("feedback.featureRequest")}
            </label>
            <textarea
              id="feedback-feature"
              rows={3}
              maxLength={1000}
              placeholder={t("feedback.featureRequestPlaceholder")}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle outline-none transition hover:border-primary/30 focus:border-primary focus:bg-surface focus:shadow-[var(--app-ring-focus)] disabled:cursor-not-allowed disabled:opacity-60"
              {...register("featureRequest")}
            />
            {errors.featureRequest && (
              <p className="mt-1 text-sm text-danger">
                {t(errors.featureRequest.message as string)}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              text={t("common.cancel")}
              onClick={onClose}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              text={t("feedback.submit")}
              isLoading={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackDialog;
