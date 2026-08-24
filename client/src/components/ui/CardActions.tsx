import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type CardActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

function CardActions({ onEdit, onDelete }: CardActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-border-subtle pt-3">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-fg-muted transition hover:bg-surface-hover hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Pencil className="size-3.5" aria-hidden />
        {t("common.edit")}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-danger transition hover:bg-danger-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
      >
        <Trash2 className="size-3.5" aria-hidden />
        {t("common.delete")}
      </button>
    </div>
  );
}

export default CardActions;
