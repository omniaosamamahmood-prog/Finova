import "dotenv/config";
import app from "./app.js";
import { logStripeConfigDiagnostics } from "./config/stripe.js";
import { startRecurringTransactionScheduler } from "./jobs/processRecurringTransactions.js";
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logStripeConfigDiagnostics("server_startup");
    startRecurringTransactionScheduler();
});
//# sourceMappingURL=server.js.map