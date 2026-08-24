import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
const router = Router();
router.get("/", authenticate, getDashboardStats);
export default router;
//# sourceMappingURL=dashboard.routes.js.map