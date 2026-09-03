import prisma from "../config/prisma.js";

export const PREMIUM_REQUIRED_MESSAGE = "This feature requires Premium";
export const PREMIUM_REQUIRED_CODE = "PREMIUM_REQUIRED";

export type UserPlan = "FREE" | "PREMIUM";

export function isPremiumPlan(plan: string | null | undefined): boolean {
  return plan === "PREMIUM";
}

export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  return user?.plan ?? null;
}

export async function isUserPremium(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return isPremiumPlan(plan);
}
