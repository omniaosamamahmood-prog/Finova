import crypto from "node:crypto";
import prisma from "../config/prisma.js";
import { PAYMOB_EGYPT_API_BASE, getPaymobHmacSecret, getPaymobIntegrationId, getPaymobPublicKey, getPaymobSecretKey, } from "../config/paymob.js";
import { getPublicApiBaseUrl } from "../utils/secureToken.js";
export const PREMIUM_AMOUNT_PIASTERS = 25000;
const PREMIUM_CURRENCY = "EGP";
const SPECIAL_REFERENCE_PREFIX = "finova-premium-";
const DEFAULT_APP_URL = "http://localhost:5173";
function getCheckoutAppUrl() {
    return process.env.APP_URL?.trim().replace(/\/$/, "") || DEFAULT_APP_URL;
}
function splitFullName(fullName) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] || "Finova";
    const lastName = parts.slice(1).join(" ") || "Customer";
    return { firstName, lastName };
}
function summarizePaymobError(status, body) {
    if (body && typeof body === "object") {
        const record = body;
        if (typeof record.detail === "string") {
            return record.detail;
        }
        const keys = Object.keys(record);
        if (keys.length > 0) {
            return `Paymob rejected the intention (${status}): ${keys.join(", ")}`;
        }
    }
    return `Paymob rejected the intention (${status})`;
}
export async function createPremiumPaymobCheckout(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, fullName: true },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const secretKey = getPaymobSecretKey();
    const publicKey = getPaymobPublicKey();
    const integrationId = getPaymobIntegrationId();
    const { firstName, lastName } = splitFullName(user.fullName);
    const appUrl = getCheckoutAppUrl();
    const specialReference = `${SPECIAL_REFERENCE_PREFIX}${user.id}-${Date.now()}`;
    const notificationUrl = `${getPublicApiBaseUrl()}/plan/paymob/webhook`;
    const response = await fetch(`${PAYMOB_EGYPT_API_BASE}/v1/intention/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${secretKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount: PREMIUM_AMOUNT_PIASTERS,
            currency: "EGP",
            payment_methods: [integrationId],
            items: [
                {
                    name: "Finova Premium",
                    amount: PREMIUM_AMOUNT_PIASTERS,
                    description: "Unlock Goals and Recurring Transactions",
                    quantity: 1,
                },
            ],
            billing_data: {
                first_name: firstName,
                last_name: lastName,
                email: user.email,
                phone_number: "01000000000",
                street: "NA",
                building: "NA",
                floor: "NA",
                apartment: "NA",
                city: "Cairo",
                country: "EGY",
                state: "Cairo",
            },
            special_reference: specialReference,
            extras: {
                userId: user.id,
                plan: "PREMIUM",
            },
            notification_url: notificationUrl,
            redirection_url: `${appUrl}/settings?checkout=success`,
        }),
    });
    const payload = (await response.json().catch(() => null));
    if (!response.ok) {
        console.error("[paymob] create intention failed", {
            status: response.status,
            message: summarizePaymobError(response.status, payload),
        });
        throw new Error("Failed to create Paymob Checkout session");
    }
    const clientSecret = payload && typeof payload === "object" && "client_secret" in payload
        ? String(payload.client_secret ?? "").trim()
        : "";
    if (!clientSecret) {
        console.error("[paymob] create intention returned no client_secret");
        throw new Error("Failed to create Paymob Checkout session");
    }
    const url = `${PAYMOB_EGYPT_API_BASE}/unifiedcheckout/?publicKey=${encodeURIComponent(publicKey)}&clientSecret=${encodeURIComponent(clientSecret)}`;
    return { url };
}
function asRecord(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                return parsed;
            }
        }
        catch {
            return null;
        }
    }
    return null;
}
function firstRecord(...candidates) {
    for (const candidate of candidates) {
        const record = asRecord(candidate);
        if (record) {
            return record;
        }
    }
    return null;
}
function isTrue(value) {
    return value === true || value === "true";
}
function isFalse(value) {
    return value === false || value === "false";
}
function readNested(record, key) {
    return record ? record[key] : undefined;
}
export function verifyPaymobTransactionHmac(obj, receivedHmac) {
    const hmac = receivedHmac.trim().toLowerCase();
    if (!hmac) {
        return false;
    }
    const sourceData = asRecord(obj.source_data);
    const order = asRecord(obj.order);
    const concatenated = [
        obj.amount_cents,
        obj.created_at,
        obj.currency,
        obj.error_occured,
        obj.has_parent_transaction,
        obj.id,
        obj.integration_id,
        obj.is_3d_secure,
        obj.is_auth,
        obj.is_capture,
        obj.is_refunded,
        obj.is_standalone_payment,
        obj.is_voided,
        readNested(order, "id"),
        obj.owner,
        obj.pending,
        readNested(sourceData, "pan"),
        readNested(sourceData, "sub_type"),
        readNested(sourceData, "type"),
        obj.success,
    ]
        .map((value) => String(value))
        .join("");
    const computed = crypto
        .createHmac("sha512", getPaymobHmacSecret())
        .update(concatenated)
        .digest("hex")
        .toLowerCase();
    const computedBuffer = Buffer.from(computed, "utf8");
    const receivedBuffer = Buffer.from(hmac, "utf8");
    return (computedBuffer.length === receivedBuffer.length &&
        crypto.timingSafeEqual(computedBuffer, receivedBuffer));
}
function extractPremiumMetadata(obj) {
    const order = asRecord(obj.order);
    const claims = firstRecord(obj.payment_key_claims, obj.claims);
    const extras = firstRecord(claims?.extra, claims?.extras, order?.extras, order?.extra, obj.extras, obj.extra);
    const extrasUserId = typeof extras?.userId === "string" ? extras.userId.trim() : "";
    const plan = typeof extras?.plan === "string" ? extras.plan.trim() : "";
    const merchantOrderId = typeof order?.merchant_order_id === "string"
        ? order.merchant_order_id.trim()
        : "";
    const referenceMatch = merchantOrderId.match(new RegExp(`^${SPECIAL_REFERENCE_PREFIX}(.+)-(\\d+)$`));
    const userId = extrasUserId || referenceMatch?.[1]?.trim() || "";
    return { userId, plan, merchantOrderId };
}
function isSuccessfulPremiumPayment(obj) {
    const amount = Number(obj.amount_cents);
    const currency = typeof obj.currency === "string" ? obj.currency.trim().toUpperCase() : "";
    const integrationId = Number(obj.integration_id);
    return (isTrue(obj.success) &&
        isFalse(obj.pending) &&
        isFalse(obj.error_occured) &&
        isFalse(obj.is_voided) &&
        isFalse(obj.is_refunded) &&
        currency === PREMIUM_CURRENCY &&
        amount === PREMIUM_AMOUNT_PIASTERS &&
        integrationId === getPaymobIntegrationId());
}
export async function fulfillPremiumPaymobTransaction(obj) {
    if (!isSuccessfulPremiumPayment(obj)) {
        return { status: "ignored", reason: "not_paid" };
    }
    const { userId, plan, merchantOrderId } = extractPremiumMetadata(obj);
    if (plan !== "PREMIUM") {
        return { status: "ignored", reason: "invalid_plan" };
    }
    if (merchantOrderId &&
        !merchantOrderId.startsWith(SPECIAL_REFERENCE_PREFIX)) {
        return { status: "ignored", reason: "invalid_reference" };
    }
    if (!userId) {
        return { status: "ignored", reason: "missing_user" };
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, plan: true },
    });
    if (!user) {
        return { status: "ignored", reason: "user_not_found" };
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
//# sourceMappingURL=paymob.service.js.map