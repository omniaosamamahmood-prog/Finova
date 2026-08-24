import { Prisma } from "../generated/prisma/client.js";
import prisma from "../config/prisma.js";
import { buildOccurrenceKey, collectDueOccurrences, getNextRunDate, MAX_CATCH_UP_OCCURRENCES, startOfUtcDay, } from "../utils/recurrence.js";
export { MAX_CATCH_UP_OCCURRENCES };
function isUniqueViolation(error) {
    return (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002");
}
async function resolveAccountId(tx, userId) {
    const account = await tx.account.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
    });
    return account?.id ?? null;
}
/**
 * Create the real Transaction for one scheduled date and advance `nextRunAt`.
 *
 * Idempotency: `occurrenceKey` is unique. A concurrent/retry run that hits the
 * same (schedule, UTC date) cannot insert a second row; it only advances
 * `nextRunAt` if needed.
 */
async function processOccurrence(params) {
    const occurrenceDate = startOfUtcDay(params.occurrenceDate);
    const nextRunAt = getNextRunDate(occurrenceDate, params.frequency);
    const occurrenceKey = buildOccurrenceKey(params.id, occurrenceDate);
    try {
        await prisma.$transaction(async (tx) => {
            const accountId = await resolveAccountId(tx, params.userId);
            await tx.transaction.create({
                data: {
                    title: params.title,
                    amount: params.amount,
                    type: params.type,
                    transactionDate: occurrenceDate,
                    categoryId: params.categoryId,
                    userId: params.userId,
                    accountId,
                    recurringTransactionId: params.id,
                    occurrenceDate,
                    occurrenceKey,
                },
            });
            await tx.recurringTransaction.update({
                where: { id: params.id },
                data: { nextRunAt },
            });
        });
        return "created";
    }
    catch (error) {
        if (!isUniqueViolation(error)) {
            throw error;
        }
        await prisma.recurringTransaction.update({
            where: { id: params.id },
            data: { nextRunAt },
        });
        return "duplicate";
    }
}
/**
 * Process every active schedule whose `nextRunAt` is due.
 *
 * Catch-up: if the server was offline, each schedule generates every missed
 * occurrence until `nextRunAt` is in the future, up to
 * `MAX_CATCH_UP_OCCURRENCES` (36) per schedule per run. Remaining dates are
 * picked up on the next run so a corrupted loop cannot run forever.
 *
 * Paused (`isActive: false`) rows are never selected.
 */
export async function processDueRecurringTransactions(now = new Date()) {
    const due = await prisma.recurringTransaction.findMany({
        where: {
            isActive: true,
            nextRunAt: { lte: now },
        },
    });
    const result = {
        scanned: due.length,
        created: 0,
        skippedDuplicates: 0,
        capped: 0,
        errors: 0,
    };
    for (const item of due) {
        try {
            const occurrences = collectDueOccurrences(item.nextRunAt, item.frequency, now, MAX_CATCH_UP_OCCURRENCES);
            if (occurrences.length === MAX_CATCH_UP_OCCURRENCES) {
                result.capped += 1;
            }
            for (const occurrenceDate of occurrences) {
                const outcome = await processOccurrence({
                    id: item.id,
                    title: item.title,
                    amount: item.amount,
                    type: item.type,
                    frequency: item.frequency,
                    categoryId: item.categoryId,
                    userId: item.userId,
                    occurrenceDate,
                });
                if (outcome === "created") {
                    result.created += 1;
                }
                else {
                    result.skippedDuplicates += 1;
                }
            }
        }
        catch (error) {
            result.errors += 1;
            console.error(`[recurring] failed to process schedule ${item.id}:`, error);
        }
    }
    return result;
}
//# sourceMappingURL=recurringTransaction.service.js.map