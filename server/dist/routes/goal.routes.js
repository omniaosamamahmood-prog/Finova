import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requirePremium } from "../middlewares/premium.middleware.js";
import { createGoal, getGoals, getGoalById, updateGoal, deleteGoal, } from "../controllers/goal.controller.js";
const router = Router();
router.use(authenticate, requirePremium);
router.post("/", createGoal);
router.get("/", getGoals);
router.get("/:id", getGoalById);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
export default router;
//# sourceMappingURL=goal.routes.js.map