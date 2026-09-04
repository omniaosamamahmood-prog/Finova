import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getPlan,
  createCheckoutSession,
  createPaymobCheckout,
  handlePaymobWebhook,
} from "../controllers/plan.controller.js";

const router = Router();

router.get("/", authenticate, getPlan);
router.post("/create-checkout-session", authenticate, createCheckoutSession);
router.post("/paymob/create-checkout", authenticate, createPaymobCheckout);
router.post("/paymob/webhook", handlePaymobWebhook);

export default router;
