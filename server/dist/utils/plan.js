import prisma from "../config/prisma.js";
export const PREMIUM_REQUIRED_MESSAGE = "This feature requires Premium";
export const PREMIUM_REQUIRED_CODE = "PREMIUM_REQUIRED";
export function isPremiumPlan(plan) {
    return plan === "PREMIUM";
}
export async function getUserPlan(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
    });
    return user?.plan ?? null;
}
export async function isUserPremium(userId) {
    const plan = await getUserPlan(userId);
    return isPremiumPlan(plan);
}
//# sourceMappingURL=plan.js.map