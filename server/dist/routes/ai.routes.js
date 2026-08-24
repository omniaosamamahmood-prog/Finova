import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { chat } from "../controllers/ai.controller.js";
const router = Router();
router.post("/chat", authenticate, chat);
export default router;
//# sourceMappingURL=ai.routes.js.map