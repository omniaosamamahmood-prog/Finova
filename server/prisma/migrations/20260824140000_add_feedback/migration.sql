-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('GENERAL', 'BUG', 'FEATURE', 'UI_UX', 'PERFORMANCE');

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "message" TEXT NOT NULL,
    "featureRequest" TEXT,
    "page" TEXT,
    "browser" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Feedback_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
);

-- CreateIndex
CREATE INDEX "Feedback_userId_createdAt_idx" ON "Feedback"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_type_idx" ON "Feedback"("type");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
