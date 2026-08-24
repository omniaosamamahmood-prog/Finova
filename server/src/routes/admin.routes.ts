import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import {
  getFeedback,
  getOverview,
  getUsers,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/overview", authenticate, requireAdmin, getOverview);
router.get("/users", authenticate, requireAdmin, getUsers);
router.get("/feedback", authenticate, requireAdmin, getFeedback);

export default router;
