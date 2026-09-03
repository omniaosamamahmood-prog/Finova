import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getPlan, createCheckoutSession } from "../controllers/plan.controller.js";

const router = Router();

router.get("/", authenticate, getPlan);
router.post("/create-checkout-session", authenticate, createCheckoutSession);

export default router;
