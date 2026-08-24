import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createRecurringTransaction, deleteRecurringTransaction, getRecurringTransactionById, getRecurringTransactions, toggleRecurringTransaction, updateRecurringTransaction, } from "../controllers/recurringTransaction.controller.js";
const router = Router();
router.post("/", authenticate, createRecurringTransaction);
router.get("/", authenticate, getRecurringTransactions);
router.patch("/:id/status", authenticate, toggleRecurringTransaction);
router.get("/:id", authenticate, getRecurringTransactionById);
router.put("/:id", authenticate, updateRecurringTransaction);
router.delete("/:id", authenticate, deleteRecurringTransaction);
export default router;
//# sourceMappingURL=recurringTransaction.routes.js.map