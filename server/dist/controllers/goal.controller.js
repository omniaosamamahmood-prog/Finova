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
        message: "Goal not found",
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
function withGoalProgress(goal) {
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    return {
        ...goal,
        progress,
    };
}
function validateGoalAmounts(targetAmount, currentAmount) {
    if (targetAmount !== undefined && Number(targetAmount) <= 0) {
        return "Target amount must be greater than zero";
    }
    if (currentAmount !== undefined && Number(currentAmount) < 0) {
        return "Current amount cannot be negative";
    }
    return null;
}
export async function createGoal(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const { name, targetAmount, currentAmount = 0, targetDate } = req.body;
        if (!name || targetAmount === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name and target amount are required",
            });
        }
        const amountError = validateGoalAmounts(targetAmount, currentAmount);
        if (amountError) {
            return res.status(400).json({
                success: false,
                message: amountError,
            });
        }
        const goal = await prisma.goal.create({
            data: {
                name,
                targetAmount,
                currentAmount,
                targetDate: targetDate ? new Date(targetDate) : null,
                userId,
            },
        });
        return res.status(201).json({
            success: true,
            data: withGoalProgress(goal),
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function getGoals(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const goals = await prisma.goal.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            data: goals.map(withGoalProgress),
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function getGoalById(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid goal id",
            });
        }
        const goal = await prisma.goal.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!goal) {
            return notFound(res);
        }
        return res.status(200).json({
            success: true,
            data: withGoalProgress(goal),
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function updateGoal(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid goal id",
            });
        }
        const { name, targetAmount, currentAmount, targetDate } = req.body;
        const existing = await prisma.goal.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existing) {
            return notFound(res);
        }
        if (name !== undefined && (typeof name !== "string" || !name.trim())) {
            return res.status(400).json({
                success: false,
                message: "Name cannot be empty",
            });
        }
        const amountError = validateGoalAmounts(targetAmount, currentAmount);
        if (amountError) {
            return res.status(400).json({
                success: false,
                message: amountError,
            });
        }
        const goal = await prisma.goal.update({
            where: { id },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(targetAmount !== undefined && { targetAmount }),
                ...(currentAmount !== undefined && { currentAmount }),
                ...(targetDate !== undefined && {
                    targetDate: targetDate ? new Date(targetDate) : null,
                }),
            },
        });
        return res.status(200).json({
            success: true,
            data: withGoalProgress(goal),
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function deleteGoal(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const id = getParamId(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid goal id",
            });
        }
        const existing = await prisma.goal.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existing) {
            return notFound(res);
        }
        await prisma.goal.delete({
            where: { id },
        });
        return res.status(200).json({
            success: true,
            message: "Goal deleted successfully",
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
//# sourceMappingURL=goal.controller.js.map