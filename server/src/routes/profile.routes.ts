import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";
import {
  changePassword,
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/", authenticate, getProfile);
router.put("/password", authenticate, changePassword);
router.put("/", authenticate, uploadAvatar, updateProfile);

export default router;
