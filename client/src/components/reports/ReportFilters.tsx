import { useTranslation } from "react-i18next";
import Select from "../ui/Select";
import { getMonthLabel } from "../../utils/format";

type ReportFiltersProps = {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

function buildYearOptions(currentYear: number): number[] {
  const start = currentYear - 6;
  return Array.from({ length: 7 }, (_, index) => start + index).reverse();
}

function ReportFilters({
  month,
  year,
  onMonthChange,
  onYearChange,
}: ReportFiltersProps) {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const years = buildYearOptions(Math.max(currentYear, year));

  return (
    <div
      className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-[20rem]"
      role="group"
      aria-label={t("reports.filters")}
    >
      <label className="min-w-0 text-start">
        <span className="mb-1.5 block text-xs font-medium text-fg-muted">
          {t("reports.month")}
        </span>
        <Select
          value={String(month)}
          aria-label={t("reports.month")}
          onChange={(event) => onMonthChange(Number(event.target.value))}
        >
          {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              {getMonthLabel(value, i18n.language, "long")}
            </option>
          ))}
        </Select>
      </label>

      <label className="min-w-0 text-start">
        <span className="mb-1.5 block text-xs font-medium text-fg-muted">
          {t("reports.year")}
        </span>
        <Select
          value={String(year)}
          aria-label={t("reports.year")}
          onChange={(event) => onYearChange(Number(event.target.value))}
        >
          {years.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}

export default ReportFilters;
