export function formatCurrency(
  amount: number,
  locale: string,
  currency = "EGP"
): string {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

export function formatUtcDate(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDate(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatGeneratedDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatLongDate(value: Date | string, locale: string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getMonthLabel(
  month: number,
  locale: string,
  width: "long" | "short" = "long"
): string {
  const date = new Date(Date.UTC(2020, month - 1, 1));
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    month: width,
    timeZone: "UTC",
  }).format(date);
}

export function formatCompactNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function toDateInputValue(value?: string): string {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}
