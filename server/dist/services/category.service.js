import prisma from "../config/prisma.js";
import { DEFAULT_CATEGORIES } from "../constants/defaultCategories.js";
export async function createDefaultCategoriesForUser(userId) {
    await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map((category) => ({
            name: category.name,
            type: category.type,
            userId,
        })),
        skipDuplicates: true,
    });
}
/** Creates default categories only when the user currently has none. */
export async function backfillDefaultCategoriesIfEmpty(userId) {
    const count = await prisma.category.count({
        where: { userId },
    });
    if (count > 0) {
        return { created: false, reason: "already_has_categories" };
    }
    await createDefaultCategoriesForUser(userId);
    return { created: true };
}
//# sourceMappingURL=category.service.js.map