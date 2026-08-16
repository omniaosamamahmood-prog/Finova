import type {Response} from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
export async function getDashboardStats( req: AuthRequest,
  res: Response){
    try{ const userId=req.user?.id;
       if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const income=await prisma.transaction.aggregate({
         where: {
        userId,
        type: "INCOME",
      }, _sum: {
        amount: true,
      },
    })
      const expense = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    });
    const transactionCount = await prisma.transaction.count({
      where: {
        userId,
      },
    });
     const totalIncome = income._sum.amount ?? 0;
    const totalExpense = expense._sum.amount ?? 0;

    const totalBalance = totalIncome - totalExpense;
     return res.status(200).json({
      success: true,
      data: {
        totalBalance,
        totalIncome,
        totalExpense,
        transactionCount,
      },
    });}catch(error){
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