import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMyFeedback, submitFeedback, } from "../controllers/feedback.controller.js";
const router = Router();
router.post("/", authenticate, submitFeedback);
router.get("/me", authenticate, getMyFeedback);
export default router;
//# sourceMappingURL=feedback.routes.js.map