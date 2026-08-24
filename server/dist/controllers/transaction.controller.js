import prisma from "../config/prisma.js";
function unauthorized(res) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized",
    });
}
function notFound(res) {
    return res.status(404).json({
        success: false,
        message: "Transaction not found",
    });
}
function handleError(res, error) {
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
export async function createTransaction(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const { title, amount, type, transactionDate, categoryId } = req.body;
        const transaction = await prisma.transaction.create({
            data: {
                title,
                amount,
                type,
                transactionDate: new Date(transactionDate),
                categoryId,
                userId,
            },
            include: {
                category: true,
            },
        });
        return res.status(201).json({
            success: true,
            data: transaction,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function getAllTransactions(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            include: {
                category: true,
            },
            orderBy: { transactionDate: "desc" },
        });
        return res.status(200).json({
            success: true,
            data: transactions,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function getTransactionById(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction id",
            });
        }
        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                category: true,
            },
        });
        if (!transaction) {
            return notFound(res);
        }
        return res.status(200).json({
            success: true,
            data: transaction,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function updateTransaction(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction id",
            });
        }
        const { title, amount, type, transactionDate, categoryId } = req.body;
        const existing = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existing) {
            return notFound(res);
        }
        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(amount !== undefined && { amount }),
                ...(type !== undefined && { type }),
                ...(categoryId !== undefined && { categoryId }),
                ...(transactionDate !== undefined && {
                    transactionDate: new Date(transactionDate),
                }),
            },
            include: {
                category: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: transaction,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function deleteTransaction(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction id",
            });
        }
        const existing = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existing) {
            return notFound(res);
        }
        await prisma.transaction.delete({
            where: { id },
        });
        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
//# sourceMappingURL=transaction.controller.js.map