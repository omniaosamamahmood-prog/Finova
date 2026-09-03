import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware.js";
import {
  PREMIUM_REQUIRED_CODE,
  PREMIUM_REQUIRED_MESSAGE,
  getUserPlan,
  isPremiumPlan,
} from "../utils/plan.js";

export async function requirePremium(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const plan = await getUserPlan(userId);

    if (!plan) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!isPremiumPlan(plan)) {
      return res.status(403).json({
        success: false,
        message: PREMIUM_REQUIRED_MESSAGE,
        code: PREMIUM_REQUIRED_CODE,
      });
    }

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
