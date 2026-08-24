import { Tags } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Category } from "../../types/api";
import { getCategoryLabel } from "../../utils/categoryLabel";
import CardActions from "../ui/CardActions";

type CategoryCardProps = {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const { t } = useTranslation();
  const isIncome = category.type === "INCOME";
  const label = getCategoryLabel(category.name, t);

  return (
    <article className="ui-card ui-card-hover p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
              isIncome
                ? "bg-success-muted text-success"
                : "bg-danger-muted text-danger"
            }`}
          >
            <Tags className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 text-start">
            <h3 className="truncate text-base font-semibold text-fg">{label}</h3>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                isIncome
                  ? "bg-success-muted text-success"
                  : "bg-danger-muted text-danger"
              }`}
            >
              {t(`categories.types.${category.type}`)}
            </span>
          </div>
        </div>
      </div>

      <CardActions
        onEdit={() => onEdit(category)}
        onDelete={() => onDelete(category)}
      />
    </article>
  );
}

export default CategoryCard;
