import type { Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

function unauthorized(res: Response) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

function notFound(res: Response) {
  return res.status(404).json({
    success: false,
    message: "Budget not found",
  });
}

function handleError(res: Response, error: unknown) {
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

function getParamId(req: AuthRequest): string | null {
  const { id } = req.params;
  if (typeof id !== "string" || !id) {
    return null;
  }
  return id;
}

async function withBudgetStats<
  T extends { amount: number; categoryId: string },
>(userId: string, budget: T) {
  const spentResult = await prisma.transaction.aggregate({
    where: {
      userId,
      categoryId: budget.categoryId,
      type: "EXPENSE",
    },
    _sum: {
      amount: true,
    },
  });

  const spent = spentResult._sum.amount ?? 0;
  const remaining = budget.amount - spent;
  const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

  return {
    ...budget,
    spent,
    remaining,
    progress,
  };
}

export async function createBudget(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const { amount, categoryId } = req.body;

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_categoryId: {
          userId,
          categoryId,
        },
      },
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: "Budget already exists for this category",
      });
    }

    const budget = await prisma.budget.create({
      data: {
        amount,
        categoryId,
        userId,
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: await withBudgetStats(userId, budget),
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getBudgets(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const budgetsWithStats = await Promise.all(
      budgets.map((budget) => withBudgetStats(userId, budget))
    );

    return res.status(200).json({
      success: true,
      data: budgetsWithStats,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getBudgetById(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget id",
      });
    }

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
      },
    });

    if (!budget) {
      return notFound(res);
    }

    return res.status(200).json({
      success: true,
      data: await withBudgetStats(userId, budget),
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateBudget(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget id",
      });
    }

    const { amount, categoryId } = req.body;

    const existing = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return notFound(res);
    }

    if (categoryId && categoryId !== existing.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId,
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      const duplicate = await prisma.budget.findUnique({
        where: {
          userId_categoryId: {
            userId,
            categoryId,
          },
        },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Budget already exists for this category",
        });
      }
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        category: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: await withBudgetStats(userId, budget),
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteBudget(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget id",
      });
    }

    const existing = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return notFound(res);
    }

    await prisma.budget.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
}
