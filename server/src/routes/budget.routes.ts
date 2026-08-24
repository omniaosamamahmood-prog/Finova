import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";

const router = Router();

router.post("/", authenticate, createBudget);
router.get("/", authenticate, getBudgets);
router.get("/:id", authenticate, getBudgetById);
router.put("/:id", authenticate, updateBudget);
router.delete("/:id", authenticate, deleteBudget);

export default router;
