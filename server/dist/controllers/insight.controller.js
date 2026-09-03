import prisma from "../config/prisma.js";
import { isUserPremium } from "../utils/plan.js";
function roundMoney(value) {
    return Math.round(value * 100) / 100;
}
function roundPercent(value) {
    return Math.round(value);
}
function createInsight(type, key, icon, params) {
    return {
        type,
        title: `insights.${key}.title`,
        message: `insights.${key}.message`,
        icon,
        ...(params ? { params } : {}),
    };
}
function currentMonthRange() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return {
        startDate: new Date(year, month, 1),
        endDate: new Date(year, month + 1, 1),
    };
}
export async function getFinancialInsights(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { startDate, endDate } = currentMonthRange();
        const monthFilter = {
            gte: startDate,
            lt: endDate,
        };
        const premium = await isUserPremium(userId);
        const [monthTransactions, monthExpenseGroups, allExpenseGroups, budgets, goals, recurringExpensesDue,] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    userId,
                    transactionDate: monthFilter,
                },
                select: {
                    amount: true,
                    type: true,
                },
            }),
            prisma.transaction.groupBy({
                by: ["categoryId"],
                where: {
                    userId,
                    type: "EXPENSE",
                    transactionDate: monthFilter,
                },
                _sum: {
                    amount: true,
                },
            }),
            prisma.transaction.groupBy({
                by: ["categoryId"],
                where: {
                    userId,
                    type: "EXPENSE",
                },
                _sum: {
                    amount: true,
                },
            }),
            prisma.budget.findMany({
                where: { userId },
                include: { category: true },
            }),
            premium
                ? prisma.goal.findMany({
                    where: { userId },
                })
                : Promise.resolve([]),
            premium
                ? prisma.recurringTransaction.findMany({
                    where: {
                        userId,
                        isActive: true,
                        type: "EXPENSE",
                        nextRunAt: monthFilter,
                    },
                    select: {
                        amount: true,
                    },
                })
                : Promise.resolve([]),
        ]);
        const insights = [];
        if (monthTransactions.length === 0) {
            insights.push(createInsight("info", "noTransactions", "lightbulb"));
        }
        if (monthExpenseGroups.length > 0) {
            const categoryIds = monthExpenseGroups.map((group) => group.categoryId);
            const categories = await prisma.category.findMany({
                where: {
                    userId,
                    id: { in: categoryIds },
                },
                select: {
                    id: true,
                    name: true,
                },
            });
            const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
            const topExpense = [...monthExpenseGroups].sort((a, b) => (b._sum.amount ?? 0) - (a._sum.amount ?? 0))[0];
            const categoryName = categoryNameById.get(topExpense.categoryId);
            if (categoryName && (topExpense._sum.amount ?? 0) > 0) {
                insights.push(createInsight("info", "highestSpending", "pie-chart", {
                    category: categoryName,
                }));
            }
        }
        const spentByCategoryId = new Map(allExpenseGroups.map((group) => [group.categoryId, group._sum.amount ?? 0]));
        for (const budget of budgets) {
            if (budget.amount <= 0)
                continue;
            const spent = spentByCategoryId.get(budget.categoryId) ?? 0;
            const progress = (spent / budget.amount) * 100;
            const categoryName = budget.category.name;
            if (spent > budget.amount) {
                insights.push(createInsight("danger", "budgetExceeded", "x-circle", {
                    category: categoryName,
                    amount: roundMoney(spent - budget.amount),
                }));
                continue;
            }
            if (progress >= 80) {
                insights.push(createInsight("warning", "budgetWarning", "alert-triangle", {
                    category: categoryName,
                }));
            }
        }
        for (const goal of goals) {
            if (goal.targetAmount <= 0)
                continue;
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            if (progress >= 100) {
                insights.push(createInsight("success", "goalComplete", "trophy", {
                    name: goal.name,
                }));
                continue;
            }
            if (progress >= 75) {
                insights.push(createInsight("success", "goalClose", "target", {
                    name: goal.name,
                }));
            }
        }
        const monthIncome = monthTransactions
            .filter((transaction) => transaction.type === "INCOME")
            .reduce((total, transaction) => total + transaction.amount, 0);
        const monthExpense = monthTransactions
            .filter((transaction) => transaction.type === "EXPENSE")
            .reduce((total, transaction) => total + transaction.amount, 0);
        if (recurringExpensesDue.length > 0) {
            const recurringTotal = recurringExpensesDue.reduce((total, item) => total + item.amount, 0);
            insights.push(createInsight("info", "recurringDue", "repeat", {
                count: recurringExpensesDue.length,
                amount: roundMoney(recurringTotal),
            }));
        }
        if (monthIncome > 0 || monthExpense > 0) {
            const savings = monthIncome - monthExpense;
            if (savings > 0 && monthIncome > 0) {
                insights.push(createInsight("success", "savingsPositive", "piggy-bank", {
                    percent: roundPercent((savings / monthIncome) * 100),
                }));
            }
            else if (monthExpense > monthIncome) {
                insights.push(createInsight("warning", "savingsNegative", "trending-down"));
            }
        }
        return res.status(200).json({
            success: true,
            data: insights,
        });
    }
    catch (error) {
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
//# sourceMappingURL=insight.controller.js.map