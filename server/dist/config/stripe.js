import Stripe from "stripe";
export class StripeConfigError extends Error {
    missingVariables;
    constructor(message, missingVariables = []) {
        super(message);
        this.name = "StripeConfigError";
        this.missingVariables = missingVariables;
    }
}
let stripe = null;
let cachedSecretKey = null;
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
    if (key.startsWith("sk_test_")) {
        return "test";
    }
    if (key.startsWith("sk_live_")) {
        return "live";
    }
    if (key.startsWith("rk_test_") || key.startsWith("rk_live_")) {
        return "restricted";
    }
    return "unexpected";
}
function classifyWebhookSecret(secret) {
    if (!secret) {
        return "missing";
    }
    if (secret.startsWith("whsec_")) {
        return "present";
    }
    return "unexpected_prefix";
}
export function getStripeConfigDiagnostics() {
    const secretKind = classifySecretKey(readEnv("STRIPE_SECRET_KEY"));
    const webhookKind = classifyWebhookSecret(readEnv("STRIPE_WEBHOOK_SECRET"));
    const missingVariables = [];
    if (secretKind === "missing") {
        missingVariables.push("STRIPE_SECRET_KEY");
    }
    if (webhookKind === "missing") {
        missingVariables.push("STRIPE_WEBHOOK_SECRET");
    }
    return {
        NODE_ENV: process.env.NODE_ENV?.trim() || "undefined",
        STRIPE_SECRET_KEY: secretKind,
        STRIPE_WEBHOOK_SECRET: webhookKind,
        missingVariables,
    };
}
export function logStripeConfigDiagnostics(reason) {
    console.error("[stripe] configuration diagnostic:", reason, getStripeConfigDiagnostics());
}
function isProduction() {
    return process.env.NODE_ENV === "production";
}
function getRequiredStripeSecretKey() {
    const secretKey = readEnv("STRIPE_SECRET_KEY");
    const kind = classifySecretKey(secretKey);
    if (!secretKey) {
        logStripeConfigDiagnostics("STRIPE_SECRET_KEY is missing");
        throw new StripeConfigError("Stripe is not configured", ["STRIPE_SECRET_KEY"]);
    }
    if (kind === "restricted" || kind === "unexpected") {
        logStripeConfigDiagnostics("STRIPE_SECRET_KEY has an unexpected key type");
        throw new StripeConfigError("Stripe is not configured", []);
    }
    if (!isProduction() && kind !== "test") {
        logStripeConfigDiagnostics("Stripe test mode is required outside production");
        throw new StripeConfigError("Stripe test mode is required");
    }
    return secretKey;
}
export function getStripe() {
    const secretKey = getRequiredStripeSecretKey();
    if (stripe && cachedSecretKey === secretKey) {
        return stripe;
    }
    stripe = new Stripe(secretKey);
    cachedSecretKey = secretKey;
    return stripe;
}
export function getStripeWebhookSecret() {
    const webhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
        logStripeConfigDiagnostics("STRIPE_WEBHOOK_SECRET is missing");
        throw new StripeConfigError("Stripe webhook secret is not configured", [
            "STRIPE_WEBHOOK_SECRET",
        ]);
    }
    return webhookSecret;
}
export function constructStripeWebhookEvent(payload, signature) {
    const webhookSecret = getStripeWebhookSecret();
    return Stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
//# sourceMappingURL=stripe.js.map