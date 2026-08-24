import cron from "node-cron";
import { processDueRecurringTransactions } from "../services/recurringTransaction.service.js";

let processing = false;
let started = false;

/**
 * In-process overlap lock. A second cron tick (or a concurrent dev script in
 * the same Node process) will skip rather than run two processors at once.
 * Cross-process safety is the unique `occurrenceKey` constraint.
 */
export async function runProcessRecurringTransactions(now = new Date()) {
  if (processing) {
    return { skipped: true as const, reason: "already-running" };
  }

  processing = true;
  try {
    const result = await processDueRecurringTransactions(now);
    return { skipped: false as const, ...result };
  } finally {
    processing = false;
  }
}

export function startRecurringTransactionScheduler() {
  if (started) {
    return;
  }

  started = true;

  cron.schedule(
    "* * * * *",
    () => {
      void runProcessRecurringTransactions()
        .then((result) => {
          if (result.skipped) {
            return;
          }
          if (
            result.created > 0 ||
            result.skippedDuplicates > 0 ||
            result.errors > 0
          ) {
            console.log("[recurring] processed", result);
          }
        })
        .catch((error: unknown) => {
          console.error("[recurring] scheduler run failed", error);
        });
    },
    {
      name: "process-recurring-transactions",
      noOverlap: true,
    }
  );

  console.log("[recurring] scheduler started (every minute)");
}
