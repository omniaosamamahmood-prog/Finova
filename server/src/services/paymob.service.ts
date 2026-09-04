import prisma from "../config/prisma.js";
import {
  PAYMOB_EGYPT_API_BASE,
  getPaymobIntegrationId,
  getPaymobPublicKey,
  getPaymobSecretKey,
} from "../config/paymob.js";

const PREMIUM_AMOUNT_PIASTERS = 25000;
const DEFAULT_APP_URL = "http://localhost:5173";

type PaymobIntentionResponse = {
  client_secret?: string;
};

function getCheckoutAppUrl() {
  return process.env.APP_URL?.trim().replace(/\/$/, "") || DEFAULT_APP_URL;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "Finova";
  const lastName = parts.slice(1).join(" ") || "Customer";
  return { firstName, lastName };
}

function summarizePaymobError(status: number, body: unknown): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
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

export async function createPremiumPaymobCheckout(userId: string): Promise<{ url: string }> {
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
  const specialReference = `finova-premium-${user.id}-${Date.now()}`;

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
      redirection_url: `${appUrl}/settings?checkout=success`,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | PaymobIntentionResponse
    | Record<string, unknown>
    | null;

  if (!response.ok) {
    console.error("[paymob] create intention failed", {
      status: response.status,
      message: summarizePaymobError(response.status, payload),
    });
    throw new Error("Failed to create Paymob Checkout session");
  }

  const clientSecret =
    payload && typeof payload === "object" && "client_secret" in payload
      ? String(payload.client_secret ?? "").trim()
      : "";

  if (!clientSecret) {
    console.error("[paymob] create intention returned no client_secret");
    throw new Error("Failed to create Paymob Checkout session");
  }

  const url = `${PAYMOB_EGYPT_API_BASE}/unifiedcheckout/?publicKey=${encodeURIComponent(
    publicKey
  )}&clientSecret=${encodeURIComponent(clientSecret)}`;

  return { url };
}
