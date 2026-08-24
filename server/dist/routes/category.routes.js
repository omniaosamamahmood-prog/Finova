import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, } from "../controllers/category.controller.js";
const router = Router();
router.post("/", authenticate, createCategory);
router.get("/", authenticate, getAllCategories);
router.get("/:id", authenticate, getCategoryById);
router.put("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);
export default router;
//# sourceMappingURL=category.routes.js.map