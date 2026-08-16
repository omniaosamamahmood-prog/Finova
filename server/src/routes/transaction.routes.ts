import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.post("/", authenticate, createTransaction);
router.get("/", authenticate, getAllTransactions);
router.get("/:id", authenticate, getTransactionById);
router.put("/:id", authenticate, updateTransaction);
router.delete("/:id", authenticate, deleteTransaction);

export default router;
