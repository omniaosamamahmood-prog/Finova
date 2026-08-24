import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import {
  createFeedback,
  listMyFeedback,
} from "../services/feedback.service.js";
import { createFeedbackSchema } from "../validations/feedback.validation.js";

function unauthorized(res: Response) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

function handleError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: error.issues[0]?.message ?? "Invalid request",
      errors: error.issues.map((issue) => issue.message),
    });
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

function omitUserId(body: unknown): unknown {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  const { userId: _ignored, ...rest } = body as Record<string, unknown>;
  return rest;
}

export async function submitFeedback(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const data = createFeedbackSchema.parse(omitUserId(req.body));
    const feedback = await createFeedback(userId, data);

    return res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getMyFeedback(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const feedback = await listMyFeedback(userId);

    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
