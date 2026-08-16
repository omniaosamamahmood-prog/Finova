import type { TFunction } from "i18next";

/** Translate a stored English category key; fall back to the raw name for custom categories. */
export function getCategoryLabel(name: string, t: TFunction): string {
  return t(`categories.${name}`, { defaultValue: name });
}
