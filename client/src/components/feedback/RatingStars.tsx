import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

type RatingStarsProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

function RatingStars({ value, onChange, disabled = false }: RatingStarsProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-label={t("feedback.rating")}
      className="flex items-center gap-0.5"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= display;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={t("feedback.starAria", { count: star })}
            disabled={disabled}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="rounded-lg p-1 text-fg-subtle transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Star
              className={`size-7 transition ${
                active ? "fill-primary text-primary" : "text-border"
              }`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

export default RatingStars;
