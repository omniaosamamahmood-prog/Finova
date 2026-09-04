export class PaymobConfigError extends Error {
    missingVariables;
    constructor(message, missingVariables = []) {
        super(message);
        this.name = "PaymobConfigError";
        this.missingVariables = missingVariables;
    }
}
const DEFAULT_INTEGRATION_ID = 5897106;
export const PAYMOB_EGYPT_API_BASE = "https://accept.paymob.com";
function readEnv(name) {
    const raw = process.env[name];
    if (typeof raw !== "string") {
        return undefined;
    }
    let value = raw.replace(/^\uFEFF/, "").trim();
    if ((value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
        (value.startsWith("'") && value.endsWith("'") && value.length >= 2)) {
        value = value.slice(1, -1).trim();
    }
    return value.length > 0 ? value : undefined;
}
function classifySecretKey(key) {
    if (!key) {
        return "missing";
    }
    if (key.includes("_sk_test_") || key.startsWith("sk_test_")) {
        return "test";
    }
    if (key.includes("_sk_live_") || key.startsWith("sk_live_")) {
        return "live";
    }
    return "unexpected";
}
function classifyPublicKey(key) {
    if (!key) {
        return "missing";
    }
    if (key.includes("_pk_test_") || key.startsWith("pk_test_")) {
        return "test";
    }
    if (key.includes("_pk_live_") || key.startsWith("pk_live_")) {
        return "live";
    }
    return "unexpected";
}
export function getPaymobConfigDiagnostics() {
    const secretKind = classifySecretKey(readEnv("PAYMOB_SECRET_KEY"));
    const publicKind = classifyPublicKey(readEnv("PAYMOB_PUBLIC_KEY"));
    const integrationId = readEnv("PAYMOB_INTEGRATION_ID");
    const missingVariables = [];
    if (secretKind === "missing") {
        missingVariables.push("PAYMOB_SECRET_KEY");
    }
    if (publicKind === "missing") {
        missingVariables.push("PAYMOB_PUBLIC_KEY");
    }
    return {
        PAYMOB_SECRET_KEY: secretKind,
        PAYMOB_PUBLIC_KEY: publicKind,
        PAYMOB_INTEGRATION_ID: integrationId ? "present" : "present",
        missingVariables,
    };
}
export function logPaymobConfigDiagnostics(reason) {
    console.error("[paymob] configuration diagnostic:", reason, getPaymobConfigDiagnostics());
}
export function getPaymobSecretKey() {
    const secretKey = readEnv("PAYMOB_SECRET_KEY");
    if (!secretKey) {
        logPaymobConfigDiagnostics("PAYMOB_SECRET_KEY is missing");
        throw new PaymobConfigError("Paymob is not configured", ["PAYMOB_SECRET_KEY"]);
    }
    return secretKey;
}
export function getPaymobPublicKey() {
    const publicKey = readEnv("PAYMOB_PUBLIC_KEY");
    if (!publicKey) {
        logPaymobConfigDiagnostics("PAYMOB_PUBLIC_KEY is missing");
        throw new PaymobConfigError("Paymob public key is not configured", [
            "PAYMOB_PUBLIC_KEY",
        ]);
    }
    return publicKey;
}
export function getPaymobIntegrationId() {
    const raw = readEnv("PAYMOB_INTEGRATION_ID");
    const parsed = raw ? Number(raw) : DEFAULT_INTEGRATION_ID;
    if (!Number.isInteger(parsed) || parsed <= 0) {
        logPaymobConfigDiagnostics("PAYMOB_INTEGRATION_ID is invalid");
        throw new PaymobConfigError("Paymob integration ID is invalid", [
            "PAYMOB_INTEGRATION_ID",
        ]);
    }
    return parsed;
}
//# sourceMappingURL=paymob.js.map