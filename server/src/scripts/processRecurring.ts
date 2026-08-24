/**
 * Development helper: process due recurring schedules immediately.
 * Usage (from /server): npm run recurring:process
 *
 * Not exposed over HTTP. Requires DATABASE_URL.
 */
import dotenv from "dotenv";
import { runProcessRecurringTransactions } from "../jobs/processRecurringTransactions.js";

dotenv.config();

const result = await runProcessRecurringTransactions();
console.log("[recurring] manual run", result);
if (result.skipped) {
  process.exit(0);
}
process.exit(result.errors > 0 ? 1 : 0);
