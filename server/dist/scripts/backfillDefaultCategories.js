import "dotenv/config";
import prisma from "../config/prisma.js";
import { backfillDefaultCategoriesIfEmpty } from "../services/category.service.js";
async function backfillDefaultCategories() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true },
        orderBy: { createdAt: "asc" },
    });
    let createdFor = 0;
    let skipped = 0;
    for (const user of users) {
        const result = await backfillDefaultCategoriesIfEmpty(user.id);
        if (result.created) {
            createdFor += 1;
            console.log(`Created default categories for ${user.email}`);
        }
        else {
            skipped += 1;
            console.log(`Skipped ${user.email} (already has categories)`);
        }
    }
    console.log(`Backfill complete. Created for ${createdFor} user(s), skipped ${skipped}.`);
}
backfillDefaultCategories()
    .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=backfillDefaultCategories.js.map