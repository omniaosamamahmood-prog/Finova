const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const LOGIN_THRESHOLD = 10;
const VISIT_THRESHOLD = 5;

const loginCountKey = (userId: string) => `finova.feedback.loginCount.${userId}`;
const visitCountKey = (userId: string) => `finova.feedback.visitCount.${userId}`;
const dismissedAtKey = (userId: string) =>
  `finova.feedback.dismissedAt.${userId}`;
const submittedAtKey = (userId: string) =>
  `finova.feedback.submittedAt.${userId}`;
const sessionFlagKey = (userId: string) =>
  `finova.feedback.visitCounted.${userId}`;
const promptShownKey = (userId: string) =>
  `finova.feedback.promptShown.${userId}`;

function readNumber(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? Number(raw) : 0;
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function writeNumber(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function readTimestamp(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? Number(raw) : NaN;
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function isWithinDays(timestamp: number | null, daysMs = THIRTY_DAYS_MS) {
  if (!timestamp) return false;
  return Date.now() - timestamp < daysMs;
}

export function recordSuccessfulLogin(userId: string) {
  if (!userId) return;
  writeNumber(loginCountKey(userId), readNumber(loginCountKey(userId)) + 1);
}

export function recordAppVisit(userId: string) {
  if (!userId || typeof sessionStorage === "undefined") return;

  try {
    if (sessionStorage.getItem(sessionFlagKey(userId))) return;
    sessionStorage.setItem(sessionFlagKey(userId), "1");
  } catch {
    return;
  }

  writeNumber(visitCountKey(userId), readNumber(visitCountKey(userId)) + 1);
}

export function markFeedbackSubmitted(userId: string) {
  if (!userId) return;
  try {
    localStorage.setItem(submittedAtKey(userId), String(Date.now()));
  } catch {
    // Ignore storage failures.
  }
}

export function dismissFeedbackPrompt(userId: string) {
  if (!userId) return;
  try {
    localStorage.setItem(dismissedAtKey(userId), String(Date.now()));
    sessionStorage.setItem(promptShownKey(userId), "1");
  } catch {
    // Ignore storage failures.
  }
}

export function markPromptShownThisSession(userId: string) {
  if (!userId) return;
  try {
    sessionStorage.setItem(promptShownKey(userId), "1");
  } catch {
    // Ignore storage failures.
  }
}

export function hasEnoughUsage(userId: string): boolean {
  if (!userId) return false;
  return (
    readNumber(loginCountKey(userId)) >= LOGIN_THRESHOLD ||
    readNumber(visitCountKey(userId)) >= VISIT_THRESHOLD
  );
}

export function wasDismissedRecently(userId: string): boolean {
  return isWithinDays(readTimestamp(dismissedAtKey(userId)));
}

export function wasSubmittedRecently(
  userId: string,
  latestFeedbackAt?: string | null
): boolean {
  if (isWithinDays(readTimestamp(submittedAtKey(userId)))) {
    return true;
  }

  if (!latestFeedbackAt) return false;
  const created = Date.parse(latestFeedbackAt);
  if (!Number.isFinite(created)) return false;
  return isWithinDays(created);
}

export function wasPromptShownThisSession(userId: string): boolean {
  if (!userId || typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(promptShownKey(userId)) === "1";
  } catch {
    return false;
  }
}

export function shouldOfferFeedbackPrompt(userId: string): boolean {
  if (!userId) return false;
  if (wasPromptShownThisSession(userId)) return false;
  if (wasDismissedRecently(userId)) return false;
  if (wasSubmittedRecently(userId)) return false;
  return hasEnoughUsage(userId);
}
