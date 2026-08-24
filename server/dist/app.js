import express from "express";
import cors from "cors";
import path from "node:path";
import budgetRoutes from "./routes/budget.routes.js";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import reportRoutes from "./routes/report.routes.js";
import insightRoutes from "./routes/insight.routes.js";
import recurringTransactionRoutes from "./routes/recurringTransaction.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import { ensureAvatarsDir } from "./utils/avatarStorage.js";
const app = express();
ensureAvatarsDir();
// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Test Route
app.use("/api", routes);
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/categories", categoryRoutes);
app.use("/budgets", budgetRoutes);
app.use("/goals", goalRoutes);
app.use("/reports", reportRoutes);
app.use("/insights", insightRoutes);
app.use("/recurring-transactions", recurringTransactionRoutes);
app.use("/ai", aiRoutes);
app.use("/profile", profileRoutes);
app.use("/feedback", feedbackRoutes);
export default app;
//# sourceMappingURL=app.js.map