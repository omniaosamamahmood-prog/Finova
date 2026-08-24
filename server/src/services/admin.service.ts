import prisma from "../config/prisma.js";
import { listAllFeedback } from "./feedback.service.js";

const FEEDBACK_TYPES = [
  "GENERAL",
  "BUG",
  "FEATURE",
  "UI_UX",
  "PERFORMANCE",
] as const;

export async function getAdminOverview() {
  const [
    usersCount,
    verifiedUsersCount,
    googleUsersCount,
    feedbackCount,
    ratingAggregate,
    feedbackByTypeRows,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { emailVerified: true } }),
    prisma.user.count({ where: { googleId: { not: null } } }),
    prisma.feedback.count(),
    prisma.feedback.aggregate({ _avg: { rating: true } }),
    prisma.feedback.groupBy({
      by: ["type"],
      _count: { _all: true },
    }),
  ]);

  const feedbackByType = Object.fromEntries(
    FEEDBACK_TYPES.map((type) => [type, 0])
  ) as Record<(typeof FEEDBACK_TYPES)[number], number>;

  for (const row of feedbackByTypeRows) {
    feedbackByType[row.type] = row._count._all;
  }

  return {
    usersCount,
    verifiedUsersCount,
    googleUsersCount,
    feedbackCount,
    averageRating: ratingAggregate._avg.rating ?? 0,
    feedbackByType,
  };
}

export async function listAdminUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      emailVerified: true,
      avatarUrl: true,
      googleId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map(({ googleId, ...user }) => ({
    ...user,
    hasGoogle: Boolean(googleId),
  }));
}

export async function listAdminFeedback() {
  return listAllFeedback();
}
