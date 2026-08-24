import axios from "axios";
import type { ApiErrorBody } from "../types/api";

const SERVER_MESSAGE_KEYS: Record<string, string> = {
  "Category already exists": "categories.errors.duplicate",
  "Cannot delete category with transactions": "categories.errors.hasTransactions",
  "Category not found": "categories.errors.notFound",
  "Cannot delete category with recurring transactions":
    "categories.errors.hasRecurring",
  "Recurring transaction not found": "recurring.errors.notFound",
  "Category type does not match transaction type":
    "recurring.errors.categoryType",
  "Invalid start date": "recurring.errors.invalidStartDate",
  "AI request failed": "ai.errors.failed",
  "AI is temporarily busy. Please try again shortly.": "ai.errors.busy",
  "AI service is temporarily unavailable": "ai.errors.unavailable",
  "AI is not configured on the server": "ai.errors.notConfigured",
  "Message is required": "errors.validation",
  "Message is too long": "errors.validation",
  "Full name must be at least 3 characters": "validation.fullName.min",
  "Current password is required": "settings.validation.currentPassword",
  "New password must be at least 6 characters": "validation.password.min",
  "Please confirm your new password": "settings.validation.confirmPassword",
  "Passwords do not match": "settings.validation.passwordMismatch",
  "Current password is incorrect": "settings.errors.currentPassword",
  "Avatar must be 2MB or smaller": "settings.validation.avatarSize",
  "Only image files are allowed": "settings.validation.avatarType",
  "Could not upload avatar": "settings.errors.avatarUpload",
  "No changes provided": "settings.errors.noChanges",
  "User not found": "settings.errors.notFound",
  "Invalid Google credential": "auth.google.invalidCredential",
  "Google email is not verified": "auth.google.emailNotVerified",
  "Google account email is missing": "auth.google.emailMissing",
  "Google sign-in is not configured": "auth.google.notConfiguredServer",
  "Google credential is required": "auth.google.invalidCredential",
  "Password login is not set for this account": "auth.google.passwordNotSet",
  "Please verify your email": "auth.login.verifyRequired",
  "Invalid or expired reset link": "auth.reset.failed",
  "Failed to send email": "auth.forgot.sendFailed",
  "Failed to send verification email": "auth.verificationSent.resendFailed",
  "Failed to send password reset email": "auth.forgot.sendFailed",
  "Email service is not configured": "auth.email.notConfigured",
  "Email sender is not verified": "auth.email.senderNotVerified",
  "Email could not be delivered to this address": "auth.email.deliveryRestricted",
  "Verification link has expired": "auth.verify.expiredTitle",
  "Invalid verification link": "auth.verify.failedTitle",
  "This account uses Google sign-in. Continue with Google, or set a password after linking email login.":
    "auth.google.passwordNotSet",
  "Password updated successfully": "settings.toasts.passwordUpdated",
  "Rating must be between 1 and 5": "feedback.validation.rating",
  "Feature request is too long": "feedback.validation.featureMax",
  "Access denied": "admin.accessDenied.title",
};

export function getErrorMessage(
  error: unknown,
  fallback = "errors.somethingWrong"
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return "errors.network";
    }

    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      return "errors.unauthorized";
    }

    if (status === 403) {
      return "admin.accessDenied.title";
    }

    if (data?.errors?.length) {
      const first = data.errors[0];
      return SERVER_MESSAGE_KEYS[first] ?? first;
    }

    if (data?.message) {
      return SERVER_MESSAGE_KEYS[data.message] ?? data.message;
    }

    if (status >= 500) {
      return "errors.server";
    }

    return "errors.validation";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
