import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getFinancialInsights } from "../controllers/insight.controller.js";
const router = Router();
router.get("/", authenticate, getFinancialInsights);
export default router;
//# sourceMappingURL=insight.routes.js.map