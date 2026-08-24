import type { Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export async function getMonthlyReport(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Valid month and year are required",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const expenses = await prisma.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        transactionDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const categoryTotals: Record<string, number> = {};

    for (const transaction of expenses) {
      const categoryName = transaction.category.name;

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + transaction.amount;
    }

    const totalExpense = expenses.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    const expensesByCategory = Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage:
          totalExpense > 0
            ? Number(((amount / totalExpense) * 100).toFixed(2))
            : 0,
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        month,
        year,
        totalExpense,
        expensesByCategory,
      },
    });
  } catch (error) {
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
}
export async function getMonthlyTrend(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const year = Number(req.query.year);

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        amount: true,
        type: true,
        transactionDate: true,
      },
    });

    const result = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      income: 0,
      expense: 0,
    }));

    for (const transaction of transactions) {
      const monthIndex = transaction.transactionDate.getMonth();

      if (transaction.type === "INCOME") {
        result[monthIndex].income += transaction.amount;
      }

      if (transaction.type === "EXPENSE") {
        result[monthIndex].expense += transaction.amount;
      }
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
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
}
export async function getTopSpendingCategories(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Valid month and year are required",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const expenses = await prisma.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        transactionDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const categoryTotals: Record<string, number> = {};

    for (const transaction of expenses) {
      const categoryName = transaction.category.name;

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + transaction.amount;
    }

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      data: topCategories,
    });
  } catch (error) {
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
}