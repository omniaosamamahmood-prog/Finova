import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requirePremium } from "../middlewares/premium.middleware.js";
import { createRecurringTransaction, deleteRecurringTransaction, getRecurringTransactionById, getRecurringTransactions, toggleRecurringTransaction, updateRecurringTransaction, } from "../controllers/recurringTransaction.controller.js";
const router = Router();
router.use(authenticate, requirePremium);
router.post("/", createRecurringTransaction);
router.get("/", getRecurringTransactions);
router.patch("/:id/status", toggleRecurringTransaction);
router.get("/:id", getRecurringTransactionById);
router.put("/:id", updateRecurringTransaction);
router.delete("/:id", deleteRecurringTransaction);
export default router;
//# sourceMappingURL=recurringTransaction.routes.js.map