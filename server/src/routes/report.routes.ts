import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getMonthlyReport,
  getMonthlyTrend,
  getTopSpendingCategories,
} from "../controllers/report.controller.js";
const router = Router();

router.get("/summary", authenticate, getMonthlyReport);
router.get(
  "/monthly-trend",
  authenticate,
  getMonthlyTrend
);
router.get(
  "/top-categories",
  authenticate,
  getTopSpendingCategories
);
export default router;