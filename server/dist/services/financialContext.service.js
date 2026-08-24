import prisma from "../config/prisma.js";
function roundMoney(value) {
    return Math.round(value * 100) / 100;
}
function roundPercent(value) {
    return Math.round(value * 100) / 100;
}
/** Same month boundary strategy as Reports / Insights. */
function currentMonthRange(now = new Date()) {
    const year = now.getFullYear();
    const month = now.getMonth();
    return {
        year,
        month: month + 1,
        startDate: new Date(year, month, 1),
        endDate: new Date(year, month + 1, 1),
    };
}
/**
 * Build a compact, user-owned financial snapshot for the AI assistant.
 * Never includes IDs, emails, passwords, or full transaction lists.
 */
export async function buildFinancialContext(userId) {
    const { year, month, startDate, endDate } = currentMonthRange();
    const monthFilter = { gte: startDate, lt: endDate };
    const [monthTransactions, allExpenseGroups, budgets, goals, activeRecurring, recurringDueThisMonth,] = await Promise.all([
        prisma.transaction.findMany({
            where: {
                userId,
                transactionDate: monthFilter,
            },
            select: {
                amount: true,
                type: true,
                categoryId: true,
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
            include: {
                category: {
                    select: { name: true },
                },
            },
        }),
        prisma.goal.findMany({
            where: { userId },
            select: {
                name: true,
                targetAmount: true,
                currentAmount: true,
                targetDate: true,
            },
        }),
        prisma.recurringTransaction.count({
            where: {
                userId,
                isActive: true,
            },
        }),
        prisma.recurringTransaction.findMany({
            where: {
                userId,
                isActive: true,
                type: "EXPENSE",
                nextRunAt: monthFilter,
            },
            select: {
                amount: true,
            },
        }),
    ]);
    const totalIncome = roundMoney(monthTransactions
        .filter((transaction) => transaction.type === "INCOME")
        .reduce((sum, transaction) => sum + transaction.amount, 0));
    const totalExpense = roundMoney(monthTransactions
        .filter((transaction) => transaction.type === "EXPENSE")
        .reduce((sum, transaction) => sum + transaction.amount, 0));
    const expenseByCategoryId = new Map();
    for (const transaction of monthTransactions) {
        if (transaction.type !== "EXPENSE")
            continue;
        expenseByCategoryId.set(transaction.categoryId, (expenseByCategoryId.get(transaction.categoryId) ?? 0) + transaction.amount);
    }
    const topCategoryIds = [...expenseByCategoryId.keys()];
    const categories = topCategoryIds.length === 0
        ? []
        : await prisma.category.findMany({
            where: {
                userId,
                id: { in: topCategoryIds },
            },
            select: {
                id: true,
                name: true,
            },
        });
    const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
    const topCategories = [...expenseByCategoryId.entries()]
        .map(([categoryId, amountRaw]) => {
        const amount = roundMoney(amountRaw);
        return {
            name: categoryNameById.get(categoryId) ?? "Unknown",
            amount,
            percentage: totalExpense > 0
                ? roundPercent((amount / totalExpense) * 100)
                : 0,
        };
    })
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
    const spentByCategoryId = new Map(allExpenseGroups.map((group) => [
        group.categoryId,
        roundMoney(group._sum.amount ?? 0),
    ]));
    const budgetContext = budgets.map((budget) => {
        const spent = spentByCategoryId.get(budget.categoryId) ?? 0;
        const remaining = roundMoney(budget.amount - spent);
        const progress = budget.amount > 0 ? roundPercent((spent / budget.amount) * 100) : 0;
        return {
            category: budget.category.name,
            amount: roundMoney(budget.amount),
            spent,
            remaining,
            progress,
            exceeded: spent > budget.amount,
        };
    });
    const goalContext = goals.map((goal) => {
        const remaining = roundMoney(goal.targetAmount - goal.currentAmount);
        const progress = goal.targetAmount > 0
            ? roundPercent((goal.currentAmount / goal.targetAmount) * 100)
            : 0;
        return {
            name: goal.name,
            targetAmount: roundMoney(goal.targetAmount),
            currentAmount: roundMoney(goal.currentAmount),
            remaining,
            progress,
            targetDate: goal.targetDate
                ? goal.targetDate.toISOString().slice(0, 10)
                : null,
        };
    });
    const upcomingExpenseTotalThisMonth = roundMoney(recurringDueThisMonth.reduce((sum, item) => sum + item.amount, 0));
    return {
        month,
        year,
        summary: {
            totalIncome,
            totalExpense,
            balance: roundMoney(totalIncome - totalExpense),
            transactionCount: monthTransactions.length,
        },
        topCategories,
        budgets: budgetContext,
        goals: goalContext,
        recurring: {
            activeRecurringCount: activeRecurring,
            upcomingExpenseTotalThisMonth,
        },
    };
}
//# sourceMappingURL=financialContext.service.js.map