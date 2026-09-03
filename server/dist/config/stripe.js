import Stripe from "stripe";
let stripe = null;
export function getStripe() {
    if (stripe) {
        return stripe;
    }
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!secretKey) {
        throw new Error("Stripe is not configured");
    }
    if (!secretKey.startsWith("sk_test_")) {
        throw new Error("Stripe test mode is required");
    }
    stripe = new Stripe(secretKey);
    return stripe;
}
export function getStripeWebhookSecret() {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    if (!webhookSecret) {
        throw new Error("Stripe webhook secret is not configured");
    }
    return webhookSecret;
}
//# sourceMappingURL=stripe.js.map