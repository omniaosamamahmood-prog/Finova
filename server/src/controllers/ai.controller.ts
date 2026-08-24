import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { askGemini } from "../services/ai.service.js";
import { buildFinancialContext } from "../services/financialContext.service.js";
import { aiChatSchema } from "../validations/ai.validation.js";

function mapAiError(error: unknown): { status: number; message: string } {
  if (error instanceof ZodError) {
    return {
      status: 400,
      message: error.issues[0]?.message ?? "Invalid request",
    };
  }

  if (error instanceof Error) {
    if (error.message === "GEMINI_API_KEY is not configured") {
      return { status: 503, message: "AI is not configured on the server" };
    }

    const lower = error.message.toLowerCase();
    if (
      lower.includes("quota") ||
      lower.includes("rate") ||
      lower.includes("429")
    ) {
      return {
        status: 429,
        message: "AI is temporarily busy. Please try again shortly.",
      };
    }

    if (
      lower.includes("fetch") ||
      lower.includes("network") ||
      lower.includes("timeout") ||
      lower.includes("econn")
    ) {
      return {
        status: 503,
        message: "AI service is temporarily unavailable",
      };
    }
  }

  return { status: 500, message: "AI request failed" };
}

export async function chat(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { message, language, history } = aiChatSchema.parse(req.body);
    const context = await buildFinancialContext(userId);
    const answer = await askGemini(context, message, language, history);

    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("[ai/chat]", error);
    const mapped = mapAiError(error);

    return res.status(mapped.status).json({
      success: false,
      message: mapped.message,
    });
  }
}
