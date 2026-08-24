export function getGoalProgressTone(progress: number): "ok" | "warn" | "done" {
  if (progress >= 100) return "done";
  if (progress >= 80) return "warn";
  return "ok";
}

export function getGoalBarWidth(progress: number): number {
  if (!Number.isFinite(progress) || progress <= 0) return 0;
  return Math.min(progress, 100);
}

export function getGoalRemaining(targetAmount: number, currentAmount: number): number {
  return targetAmount - currentAmount;
}

export function isGoalOverdue(
  targetDate: string | null,
  progress: number
): boolean {
  if (!targetDate || progress >= 100) return false;

  const date = new Date(targetDate);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date < today;
}

export function toOptionalDateInputValue(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}
