import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createGoal, getGoals, getGoalById, updateGoal, deleteGoal, } from "../controllers/goal.controller.js";
const router = Router();
router.post("/", authenticate, createGoal);
router.get("/", authenticate, getGoals);
router.get("/:id", authenticate, getGoalById);
router.put("/:id", authenticate, updateGoal);
router.delete("/:id", authenticate, deleteGoal);
export default router;
//# sourceMappingURL=goal.routes.js.map