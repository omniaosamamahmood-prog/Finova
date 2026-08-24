import prisma from "../config/prisma.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "./email.service.js";
import {
  createSecureToken,
  EMAIL_VERIFICATION_TTL_MS,
  expiresAtFromNow,
  getAppUrl,
  getPublicApiBaseUrl,
  PASSWORD_RESET_TTL_MS,
} from "../utils/secureToken.js";
import { comparePassword, hashPassword } from "../utils/hash.js";

export class AuthEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthEmailError";
  }
}

export async function issueEmailVerification(params: {
  userId: string;
  email: string;
  fullName: string;
  apiBaseUrl: string;
}) {
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: params.userId },
  });

  const token = createSecureToken();
  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: params.userId,
      expiresAt: expiresAtFromNow(EMAIL_VERIFICATION_TTL_MS),
    },
  });

  const verifyUrl = `${params.apiBaseUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;

  try {
    await sendVerificationEmail({
      to: params.email,
      fullName: params.fullName,
      verifyUrl,
    });
  } catch (error) {
    // Always log the link in non-production so local testing is not blocked
    // if SMTP delivery fails.
    const isLocal =
      process.env.NODE_ENV !== "production" ||
      process.env.APP_URL?.includes("localhost");
    if (isLocal) {
      console.warn(
        `[email] Verification email was not delivered to ${params.email}.` +
          ` Open this link to verify manually:\n${verifyUrl}`
      );
    }
    throw error;
  }
}

export async function verifyEmailToken(token: string): Promise<"success" | "expired" | "failed"> {
  if (!token?.trim()) return "failed";

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token: token.trim() },
    include: { user: { select: { id: true } } },
  });

  if (!record) return "failed";

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.emailVerificationToken.delete({ where: { id: record.id } });
    return "expired";
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    }),
    prisma.emailVerificationToken.deleteMany({
      where: { userId: record.userId },
    }),
  ]);

  return "success";
}

export async function resendVerificationEmail(
  email: string,
  apiBaseUrl: string
) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: {
      id: true,
      email: true,
      fullName: true,
      emailVerified: true,
      googleId: true,
    },
  });

  // Always act friendly — don't reveal whether the email exists.
  if (!user || user.emailVerified || user.googleId) {
    return {
      success: true,
      message: "If an account exists for this email, a verification link was sent",
    };
  }

  try {
    await issueEmailVerification({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      apiBaseUrl,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Email service is not configured" ||
        error.message === "Email sender is not verified" ||
        error.message === "Email could not be delivered to this address"
      ) {
        throw new AuthEmailError(error.message);
      }
    }
    throw new AuthEmailError("Failed to send verification email");
  }

  return {
    success: true,
    message: "If an account exists for this email, a verification link was sent",
  };
}

export async function forgotPassword(email: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: {
      id: true,
      email: true,
      fullName: true,
      password: true,
      googleId: true,
    },
  });

  const generic = {
    success: true,
    message: "If an account exists for this email, a reset link was sent",
  };

  if (!user) {
    return generic;
  }

  // Google-only account with no password — still return generic success,
  // but do not send a useless reset link.
  if (!user.password) {
    return generic;
  }

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  const token = createSecureToken();
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: expiresAtFromNow(PASSWORD_RESET_TTL_MS),
    },
  });

  const appUrl = getAppUrl();
  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      fullName: user.fullName,
      resetUrl,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Email service is not configured" ||
        error.message === "Email sender is not verified" ||
        error.message === "Email could not be delivered to this address"
      ) {
        throw new AuthEmailError(error.message);
      }
    }
    throw new AuthEmailError("Failed to send password reset email");
  }

  return generic;
}

export async function resetPassword(params: {
  token: string;
  password: string;
}) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token: params.token.trim() },
  });

  if (!record) {
    throw new AuthEmailError("Invalid or expired reset link");
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.passwordResetToken.delete({ where: { id: record.id } });
    throw new AuthEmailError("Invalid or expired reset link");
  }

  const hashed = await hashPassword(params.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        password: hashed,
        emailVerified: true,
      },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: record.userId },
    }),
  ]);

  return {
    success: true,
    message: "Password updated successfully",
  };
}

export async function changePasswordForUser(params: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { password: true, googleId: true },
  });

  if (!user) {
    throw new AuthEmailError("User not found");
  }

  if (!user.password) {
    throw new AuthEmailError(
      "This account uses Google sign-in. Continue with Google, or set a password after linking email login."
    );
  }

  const valid = await comparePassword(params.currentPassword, user.password);
  if (!valid) {
    throw new AuthEmailError("Current password is incorrect");
  }

  const hashed = await hashPassword(params.newPassword);
  await prisma.user.update({
    where: { id: params.userId },
    data: { password: hashed },
  });

  return {
    success: true,
    message: "Password updated successfully",
  };
}

export function resolveApiBaseUrl(req: {
  get(name: string): string | undefined;
  protocol?: string;
  headers: { host?: string };
}) {
  // Prefer explicit API_URL so verification links in emails are stable.
  const fromEnv =
    process.env.API_URL?.trim().replace(/\/$/, "") ||
    process.env.SERVER_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  const forwardedProto = req.get("x-forwarded-proto");
  const protocol =
    forwardedProto?.split(",")[0]?.trim() ||
    (req.protocol === "https" ? "https" : "http");
  const host = req.get("host") || req.headers.host;
  return getPublicApiBaseUrl(host, protocol);
}
