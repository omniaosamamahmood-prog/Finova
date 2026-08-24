import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
const router = Router();
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
export default router;
//# sourceMappingURL=index.js.map