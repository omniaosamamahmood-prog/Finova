import { Router } from "express";
import {
  changePasswordHandler,
  forgotPasswordHandler,
  googleAuth,
  login,
  register,
  resendVerification,
  resetPasswordHandler,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);
router.post("/change-password", authenticate, changePasswordHandler);

export default router;
