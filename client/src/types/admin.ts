import type { UserPlan } from "./api";
import type { FeedbackType } from "./feedback";

export type AdminOverview = {
  usersCount: number;
  verifiedUsersCount: number;
  googleUsersCount: number;
  feedbackCount: number;
  averageRating: number;
  feedbackByType: Record<FeedbackType, number>;
};

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  hasGoogle: boolean;
  plan: UserPlan;
  createdAt: string;
};

export type AdminFeedbackItem = {
  id: string;
  userId: string;
  rating: number;
  type: FeedbackType;
  message: string;
  featureRequest: string | null;
  page: string | null;
  browser: string | null;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
};
