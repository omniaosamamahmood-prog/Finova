/**
 * Recurring schedule date math.
 *
 * Timezone strategy (UTC calendar dates):
 * Finova does not store a per-user timezone. All recurrence is computed on
 * UTC calendar days. A start date of `2026-09-01` is stored and compared as
 * `2026-09-01T00:00:00.000Z`. The processor fires once that UTC day has begun.
 *
 * This avoids DST shifts (adding calendar days/months never uses local hours)
 * and avoids “a day early/late” bugs from mixing local midnight with UTC ISO
 * strings. The UI date picker sends `YYYY-MM-DD`, which JavaScript parses as UTC.
 *
 * Month-end / leap years:
 * Adding a month clamps to the last valid day of the target month.
 * Examples: 31 Jan → 28 Feb (or 29 in a leap year); 29 Feb → 28 Feb next year.
 */
/** Max missed occurrences generated per schedule per processor run. */
export const MAX_CATCH_UP_OCCURRENCES = 36;
export function startOfUtcDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
/**
 * Parse a date-only string (`YYYY-MM-DD`) or ISO datetime as a UTC calendar day.
 */
export function parseUtcDate(value) {
    if (!value || typeof value !== "string") {
        return null;
    }
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (dateOnly) {
        const year = Number(dateOnly[1]);
        const month = Number(dateOnly[2]);
        const day = Number(dateOnly[3]);
        const parsed = new Date(Date.UTC(year, month - 1, day));
        if (parsed.getUTCFullYear() !== year ||
            parsed.getUTCMonth() !== month - 1 ||
            parsed.getUTCDate() !== day) {
            return null;
        }
        return parsed;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    return startOfUtcDay(parsed);
}
export function formatUtcDateKey(date) {
    const d = startOfUtcDay(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
export function buildOccurrenceKey(recurringTransactionId, occurrenceDate) {
    return `${recurringTransactionId}:${formatUtcDateKey(occurrenceDate)}`;
}
export function addUtcDays(date, days) {
    const d = startOfUtcDay(date);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days));
}
/**
 * Add calendar months in UTC, clamping the day when the target month is shorter.
 */
export function addCalendarMonthsUtc(date, months) {
    const d = startOfUtcDay(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    const target = new Date(Date.UTC(year, month + months, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    return new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(day, lastDay)));
}
/**
 * Advance one scheduled occurrence from `from` (inclusive of that date as the
 * last run). The result is always strictly after `from`.
 */
export function getNextRunDate(from, frequency) {
    const current = startOfUtcDay(from);
    let next;
    switch (frequency) {
        case "DAILY":
            next = addUtcDays(current, 1);
            break;
        case "WEEKLY":
            next = addUtcDays(current, 7);
            break;
        case "MONTHLY":
            next = addCalendarMonthsUtc(current, 1);
            break;
        case "YEARLY":
            next = addCalendarMonthsUtc(current, 12);
            break;
        default: {
            const exhaustive = frequency;
            throw new Error(`Unsupported frequency: ${exhaustive}`);
        }
    }
    if (next.getTime() <= current.getTime()) {
        throw new Error("getNextRunDate must always advance the calendar date");
    }
    return next;
}
/**
 * Initial / resumed `nextRunAt`.
 *
 * - If `startDate` is today or in the future (UTC day): use `startDate`.
 * - If `startDate` is in the past: walk forward by frequency until the date is
 *   today or later. Missed historical dates are NOT generated on create/resume.
 */
export function computeNextRunAt(startDate, frequency, now = new Date()) {
    let cursor = startOfUtcDay(startDate);
    const today = startOfUtcDay(now);
    let guard = 0;
    while (cursor.getTime() < today.getTime() && guard < 10_000) {
        cursor = getNextRunDate(cursor, frequency);
        guard += 1;
    }
    return cursor;
}
/**
 * Occurrences that are due at `now`, including catch-up, capped per run.
 * `from` is the stored `nextRunAt` (the next unpaid scheduled date).
 */
export function collectDueOccurrences(from, frequency, now = new Date(), max = MAX_CATCH_UP_OCCURRENCES) {
    const due = [];
    let cursor = startOfUtcDay(from);
    const limit = now.getTime();
    while (cursor.getTime() <= limit && due.length < max) {
        due.push(cursor);
        cursor = getNextRunDate(cursor, frequency);
    }
    return due;
}
//# sourceMappingURL=recurrence.js.map