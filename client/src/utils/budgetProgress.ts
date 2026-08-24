export function getBudgetProgressTone(progress: number): "ok" | "warn" | "over" {
  if (progress >= 100) return "over";
  if (progress >= 80) return "warn";
  return "ok";
}

export function getBudgetBarWidth(progress: number): number {
  if (!Number.isFinite(progress) || progress <= 0) return 0;
  return Math.min(progress, 100);
}
