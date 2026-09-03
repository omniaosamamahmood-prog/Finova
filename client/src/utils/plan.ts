import type { UserPlan } from "../types/api";

export type PremiumFeature = "goals" | "recurring";

export function isPremiumPlan(plan: UserPlan | null | undefined): boolean {
  return plan === "PREMIUM";
}

export function resolveUserPlan(
  plan: UserPlan | null | undefined
): UserPlan {
  return plan === "PREMIUM" ? "PREMIUM" : "FREE";
}
