import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addCalendarMonthsUtc,
  buildOccurrenceKey,
  collectDueOccurrences,
  computeNextRunAt,
  formatUtcDateKey,
  getNextRunDate,
  MAX_CATCH_UP_OCCURRENCES,
  parseUtcDate,
  startOfUtcDay,
} from "./recurrence.js";

function utc(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

describe("parseUtcDate", () => {
  it("parses YYYY-MM-DD as UTC midnight", () => {
    const date = parseUtcDate("2026-09-01");
    assert.ok(date);
    assert.equal(date.toISOString(), "2026-09-01T00:00:00.000Z");
  });

  it("rejects invalid calendar dates", () => {
    assert.equal(parseUtcDate("2026-02-31"), null);
  });
});

describe("getNextRunDate", () => {
  it("advances daily by one UTC day", () => {
    assert.equal(
      getNextRunDate(utc(2026, 8, 21), "DAILY").toISOString(),
      "2026-08-22T00:00:00.000Z"
    );
  });

  it("advances weekly by seven UTC days", () => {
    assert.equal(
      getNextRunDate(utc(2026, 8, 21), "WEEKLY").toISOString(),
      "2026-08-28T00:00:00.000Z"
    );
  });

  it("advances monthly by one calendar month", () => {
    assert.equal(
      getNextRunDate(utc(2026, 6, 5), "MONTHLY").toISOString(),
      "2026-07-05T00:00:00.000Z"
    );
  });

  it("advances yearly by one calendar year", () => {
    assert.equal(
      getNextRunDate(utc(2026, 1, 15), "YEARLY").toISOString(),
      "2027-01-15T00:00:00.000Z"
    );
  });

  it("clamps January 31 monthly recurrence to February", () => {
    assert.equal(
      getNextRunDate(utc(2026, 1, 31), "MONTHLY").toISOString(),
      "2026-02-28T00:00:00.000Z"
    );
  });

  it("keeps February 29 in a leap year and clamps the next year", () => {
    assert.equal(
      getNextRunDate(utc(2024, 2, 29), "YEARLY").toISOString(),
      "2025-02-28T00:00:00.000Z"
    );
    assert.equal(
      addCalendarMonthsUtc(utc(2024, 1, 31), 1).toISOString(),
      "2024-02-29T00:00:00.000Z"
    );
  });
});

describe("computeNextRunAt", () => {
  it("uses a future start date as-is", () => {
    const next = computeNextRunAt(utc(2026, 9, 1), "MONTHLY", utc(2026, 8, 21));
    assert.equal(next.toISOString(), "2026-09-01T00:00:00.000Z");
  });

  it("uses today as the next run (does not skip the first occurrence)", () => {
    const next = computeNextRunAt(utc(2026, 8, 21), "MONTHLY", utc(2026, 8, 21));
    assert.equal(next.toISOString(), "2026-08-21T00:00:00.000Z");
  });

  it("walks a past monthly start date forward to the next valid day", () => {
    const next = computeNextRunAt(utc(2026, 6, 5), "MONTHLY", utc(2026, 8, 21));
    assert.equal(next.toISOString(), "2026-09-05T00:00:00.000Z");
  });
});

describe("collectDueOccurrences", () => {
  it("returns every missed monthly date up to now", () => {
    const due = collectDueOccurrences(
      utc(2026, 6, 1),
      "MONTHLY",
      utc(2026, 8, 20)
    );
    assert.deepEqual(
      due.map((date) => date.toISOString()),
      [
        "2026-06-01T00:00:00.000Z",
        "2026-07-01T00:00:00.000Z",
        "2026-08-01T00:00:00.000Z",
      ]
    );
  });

  it("does not include a future nextRunAt", () => {
    const due = collectDueOccurrences(
      utc(2026, 9, 1),
      "MONTHLY",
      utc(2026, 8, 21)
    );
    assert.equal(due.length, 0);
  });

  it("caps catch-up at MAX_CATCH_UP_OCCURRENCES", () => {
    const due = collectDueOccurrences(
      utc(2020, 1, 1),
      "DAILY",
      utc(2026, 8, 21)
    );
    assert.equal(due.length, MAX_CATCH_UP_OCCURRENCES);
  });
});

describe("occurrence key", () => {
  it("is stable for a recurring id and UTC date", () => {
    const date = startOfUtcDay(utc(2026, 8, 21));
    assert.equal(formatUtcDateKey(date), "2026-08-21");
    assert.equal(
      buildOccurrenceKey("rec_1", date),
      "rec_1:2026-08-21"
    );
  });
});
