import { ZodError } from "zod";
import prisma from "../config/prisma.js";
import { computeNextRunAt, parseUtcDate, } from "../utils/recurrence.js";
import { createRecurringTransactionSchema, toggleRecurringTransactionSchema, updateRecurringTransactionSchema, } from "../validations/recurringTransaction.validation.js";
const categorySelect = {
    id: true,
    name: true,
    type: true,
};
function unauthorized(res) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized",
    });
}
function notFound(res) {
    return res.status(404).json({
        success: false,
        message: "Recurring transaction not found",
    });
}
function handleError(res, error) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            errors: error.issues.map((issue) => issue.message),
        });
    }
    if (error instanceof Error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
function getParamId(req) {
    const { id } = req.params;
    if (typeof id !== "string" || !id) {
        return null;
    }
    return id;
}
function serialize(item) {
    return {
        id: item.id,
        title: item.title,
        amount: item.amount,
        type: item.type,
        frequency: item.frequency,
        startDate: item.startDate,
        nextRunAt: item.nextRunAt,
        isActive: item.isActive,
        categoryId: item.categoryId,
        category: item.category,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}
async function assertOwnedCategory(userId, categoryId, expectedType) {
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        select: categorySelect,
    });
    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }
    if (expectedType && category.type !== expectedType) {
        throw new Error("Category type does not match transaction type");
    }
    return category;
}
export async function createRecurringTransaction(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const data = createRecurringTransactionSchema.parse(req.body);
        const startDate = parseUtcDate(data.startDate);
        if (!startDate) {
            return res.status(400).json({
                success: false,
                message: "Invalid start date",
            });
        }
        await assertOwnedCategory(userId, data.categoryId, data.type);
        const nextRunAt = computeNextRunAt(startDate, data.frequency);
        const item = await prisma.recurringTransaction.create({
            data: {
                title: data.title,
                amount: data.amount,
                type: data.type,
                frequency: data.frequency,
                startDate,
                nextRunAt,
                isActive: data.isActive ?? true,
                categoryId: data.categoryId,
                userId,
            },
            include: {
                category: { select: categorySelect },
            },
        });
        return res.status(201).json({
            success: true,
            data: serialize(item),
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "Category not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        return handleError(res, error);
    }
}
export async function getRecurringTransactions(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const items = await prisma.recurringTransaction.findMany({
            where: { userId },
            include: {
                category: { select: categorySelect },
            },
            orderBy: [{ isActive: "desc" }, { nextRunAt: "asc" }],
        });
        return res.status(200).json({
            success: true,
            data: items.map(serialize),
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function getRecurringTransactionById(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid recurring transaction id",
            });
        }
        const item = await prisma.recurringTransaction.findFirst({
            where: { id, userId },
            include: {
                category: { select: categorySelect },
            },
        });
        if (!item) {
            return notFound(res);
        }
        return res.status(200).json({
            success: true,
            data: serialize(item),
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function updateRecurringTransaction(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid recurring transaction id",
            });
        }
        const data = updateRecurringTransactionSchema.parse(req.body);
        const existing = await prisma.recurringTransaction.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            return notFound(res);
        }
        const nextType = data.type ?? existing.type;
        const nextFrequency = data.frequency ?? existing.frequency;
        const nextCategoryId = data.categoryId ?? existing.categoryId;
        if (data.categoryId || data.type) {
            await assertOwnedCategory(userId, nextCategoryId, nextType);
        }
        let startDate = existing.startDate;
        if (data.startDate !== undefined) {
            const parsed = parseUtcDate(data.startDate);
            if (!parsed) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid start date",
                });
            }
            startDate = parsed;
        }
        const scheduleChanged = data.startDate !== undefined || data.frequency !== undefined;
        const resuming = data.isActive === true && !existing.isActive;
        let nextRunAt = existing.nextRunAt;
        if (scheduleChanged || resuming) {
            nextRunAt = computeNextRunAt(startDate, nextFrequency);
        }
        const item = await prisma.recurringTransaction.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.amount !== undefined && { amount: data.amount }),
                ...(data.type !== undefined && { type: data.type }),
                ...(data.frequency !== undefined && { frequency: data.frequency }),
                ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
                ...(data.startDate !== undefined && { startDate }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                nextRunAt,
            },
            include: {
                category: { select: categorySelect },
            },
        });
        return res.status(200).json({
            success: true,
            data: serialize(item),
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "Category not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        return handleError(res, error);
    }
}
export async function toggleRecurringTransaction(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid recurring transaction id",
            });
        }
        const { isActive } = toggleRecurringTransactionSchema.parse(req.body);
        const existing = await prisma.recurringTransaction.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            return notFound(res);
        }
        const nextRunAt = isActive
            ? computeNextRunAt(existing.startDate, existing.frequency)
            : existing.nextRunAt;
        const item = await prisma.recurringTransaction.update({
            where: { id },
            data: {
                isActive,
                nextRunAt,
            },
            include: {
                category: { select: categorySelect },
            },
        });
        return res.status(200).json({
            success: true,
            data: serialize(item),
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function deleteRecurringTransaction(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid recurring transaction id",
            });
        }
        const existing = await prisma.recurringTransaction.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            return notFound(res);
        }
        await prisma.recurringTransaction.delete({
            where: { id },
        });
        return res.status(200).json({
            success: true,
            message: "Recurring transaction deleted successfully",
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
//# sourceMappingURL=recurringTransaction.controller.js.map