import type { Request, Response } from "express";
import type Stripe from "stripe";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import {
  StripeConfigError,
  constructStripeWebhookEvent,
  getStripeConfigDiagnostics,
  logStripeConfigDiagnostics,
} from "../config/stripe.js";
import {
  createPremiumCheckoutSession,
  fulfillPremiumCheckoutFromSession,
} from "../services/plan.service.js";
import { getUserPlan } from "../utils/plan.js";

function unauthorized(res: Response) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

function handleError(res: Response, error: unknown) {
  if (error instanceof StripeConfigError) {
    logStripeConfigDiagnostics(error.message);
  }

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

export async function getPlan(req: AuthRequest, res: Response) {
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
  } catch (error) {
    return handleError(res, error);
  }
}

export async function createCheckoutSession(req: AuthRequest, res: Response) {
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
  } catch (error) {
    return handleError(res, error);
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature || Array.isArray(signature)) {
    return res.status(400).send("Missing Stripe signature");
  }

  if (!Buffer.isBuffer(req.body) && typeof req.body !== "string") {
    console.error("[stripe] webhook raw body is missing; JSON parsing ran too early");
    return res.status(400).send("Webhook Error: Invalid payload");
  }

  let event: Stripe.Event;

  try {
    event = constructStripeWebhookEvent(req.body, signature);
  } catch (error) {
    if (error instanceof StripeConfigError) {
      const diagnostics = getStripeConfigDiagnostics();
      logStripeConfigDiagnostics(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
        missingVariables: diagnostics.missingVariables,
        diagnostics,
      });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Webhook signature verification failed";
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillPremiumCheckoutFromSession(session);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook handler failed",
    });
  }
}
