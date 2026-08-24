import prisma from "../config/prisma.js";
import type { CreateFeedbackInput } from "../validations/feedback.validation.js";

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function createFeedback(
  userId: string,
  input: CreateFeedbackInput
) {
  return prisma.feedback.create({
    data: {
      userId,
      rating: input.rating,
      type: input.type,
      message: input.message.trim(),
      featureRequest: emptyToNull(input.featureRequest),
      page: emptyToNull(input.page),
      browser: emptyToNull(input.browser),
    },
  });
}

export async function listMyFeedback(userId: string) {
  return prisma.feedback.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/** Admin-ready listing. Not mounted on a public route yet. */
export async function listAllFeedback() {
  return prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}
