export const FEEDBACK_TYPES = [
  "GENERAL",
  "BUG",
  "FEATURE",
  "UI_UX",
  "PERFORMANCE",
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export type Feedback = {
  id: string;
  userId: string;
  rating: number;
  type: FeedbackType;
  message: string;
  featureRequest: string | null;
  page: string | null;
  browser: string | null;
  createdAt: string;
};

export type FeedbackPayload = {
  rating: number;
  type: FeedbackType;
  message: string;
  featureRequest?: string;
  page?: string;
  browser?: string;
};
