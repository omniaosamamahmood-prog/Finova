import crypto from "node:crypto";
export const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const PASSWORD_RESET_TTL_MS = 15 * 60 * 1000; // 15 minutes
export function createSecureToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString("hex");
}
export function expiresAtFromNow(ttlMs) {
    return new Date(Date.now() + ttlMs);
}
export function getAppUrl() {
    const appUrl = process.env.APP_URL?.trim().replace(/\/$/, "");
    if (!appUrl) {
        throw new Error("APP_URL is not configured");
    }
    return appUrl;
}
export function getPublicApiBaseUrl(reqHost, protocol = "http") {
    const fromEnv = process.env.API_URL?.trim().replace(/\/$/, "") ||
        process.env.SERVER_URL?.trim().replace(/\/$/, "");
    if (fromEnv)
        return fromEnv;
    if (reqHost)
        return `${protocol}://${reqHost}`;
    return "http://localhost:5000";
}
//# sourceMappingURL=secureToken.js.map