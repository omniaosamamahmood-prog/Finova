import prisma from "../config/prisma.js";
import { getStripe } from "../config/stripe.js";
const PREMIUM_AMOUNT_CENTS = 500;
const DEFAULT_APP_URL = "http://localhost:5173";
function getCheckoutAppUrl() {
    return process.env.APP_URL?.trim().replace(/\/$/, "") || DEFAULT_APP_URL;
}
export async function fulfillPremiumCheckoutFromSession(session) {
    if (session.payment_status !== "paid") {
        return { status: "ignored", reason: "not_paid" };
    }
    const userId = session.metadata?.userId?.trim();
    if (!userId) {
        throw new Error("Missing userId in checkout session metadata");
    }
    if (session.metadata?.plan !== "PREMIUM") {
        throw new Error("Invalid checkout session plan metadata");
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, plan: true },
    });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.plan === "PREMIUM") {
        return {
            status: "already_premium",
            user: { id: user.id, plan: "PREMIUM" },
        };
    }
    const updated = await prisma.user.update({
        where: { id: userId },
        data: { plan: "PREMIUM" },
        select: {
            id: true,
            plan: true,
        },
    });
    return {
        status: "upgraded",
        user: { id: updated.id, plan: "PREMIUM" },
    };
}
export async function setUserPlan(userId, plan) {
    return prisma.user.update({
        where: { id: userId },
        data: { plan },
        select: {
            id: true,
            fullName: true,
            email: true,
            plan: true,
        },
    });
}
export async function createPremiumCheckoutSession(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const appUrl = getCheckoutAppUrl();
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: PREMIUM_AMOUNT_CENTS,
                    product_data: {
                        name: "Finova Premium",
                        description: "Unlock Goals and Recurring Transactions",
                    },
                },
            },
        ],
        success_url: `${appUrl}/settings?checkout=success`,
        cancel_url: `${appUrl}/settings?checkout=canceled`,
        client_reference_id: user.id,
        customer_email: user.email,
        metadata: {
            userId: user.id,
            plan: "PREMIUM",
        },
    });
    if (!session.url) {
        throw new Error("Failed to create Stripe Checkout session");
    }
    return { url: session.url };
}
//# sourceMappingURL=plan.service.js.map