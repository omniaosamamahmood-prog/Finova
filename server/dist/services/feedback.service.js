import prisma from "../config/prisma.js";
function emptyToNull(value) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}
export async function createFeedback(userId, input) {
    return prisma.feedback.create({
        data: {
            userId,
            rating: input.rating,
            type: input.type,
            message: input.message.trim(),
            featureRequest: emptyToNull(input.featureRequest),
            page: emptyToNull(input.page),
            browser: emptyToNull(input.browser),
        },
    });
}
export async function listMyFeedback(userId) {
    return prisma.feedback.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}
/** Admin-ready listing. Not mounted on a public route yet. */
export async function listAllFeedback() {
    return prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        },
    });
}
//# sourceMappingURL=feedback.service.js.map