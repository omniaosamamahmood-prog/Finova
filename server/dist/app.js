import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
// Test Route
app.use("/api", routes);
app.use("/auth", authRoutes);
export default app;
//# sourceMappingURL=app.js.map