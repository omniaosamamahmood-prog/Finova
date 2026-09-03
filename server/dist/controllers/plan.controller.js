import { getStripe, getStripeWebhookSecret } from "../config/stripe.js";
import { createPremiumCheckoutSession, fulfillPremiumCheckoutFromSession, } from "../services/plan.service.js";
import { getUserPlan } from "../utils/plan.js";
function unauthorized(res) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized",
    });
}
function handleError(res, error) {
    if (error instanceof Error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
export async function getPlan(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const plan = await getUserPlan(userId);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: { plan },
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function createCheckoutSession(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const data = await createPremiumCheckoutSession(userId);
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function handleStripeWebhook(req, res) {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
        return res.status(400).send("Missing Stripe signature");
    }
    let event;
    try {
        const stripe = getStripe();
        const webhookSecret = getStripeWebhookSecret();
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Webhook signature verification failed";
        return res.status(400).send(`Webhook Error: ${message}`);
    }
    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            await fulfillPremiumCheckoutFromSession(session);
        }
        return res.status(200).json({ received: true });
    }
    catch (error) {
        console.error("Stripe webhook handler error:", error);
        return res.status(500).json({
            success: false,
            message: "Webhook handler failed",
        });
    }
}
//# sourceMappingURL=plan.controller.js.map