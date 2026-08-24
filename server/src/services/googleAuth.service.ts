import { OAuth2Client } from "google-auth-library";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/token.js";
import { createDefaultCategoriesForUser } from "./category.service.js";

const userSelect = {
  id: true,
  fullName: true,
  email: true,
  avatarUrl: true,
  googleId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class GoogleAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleAuthError";
  }
}

function getGoogleClientId() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    throw new GoogleAuthError("Google sign-in is not configured");
  }
  return clientId;
}

async function verifyGoogleCredential(credential: string) {
  const clientId = getGoogleClientId();
  const client = new OAuth2Client(clientId);

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
  } catch {
    throw new GoogleAuthError("Invalid Google credential");
  }

  const payload = ticket.getPayload();
  if (!payload) {
    throw new GoogleAuthError("Invalid Google credential");
  }

  if (payload.aud !== clientId) {
    throw new GoogleAuthError("Invalid Google credential");
  }

  if (!payload.email) {
    throw new GoogleAuthError("Google account email is missing");
  }

  if (payload.email_verified !== true) {
    throw new GoogleAuthError("Google email is not verified");
  }

  if (!payload.sub) {
    throw new GoogleAuthError("Invalid Google credential");
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    fullName: payload.name?.trim() || payload.email.split("@")[0] || "User",
    avatarUrl: payload.picture ?? null,
  };
}

function toAuthResult(user: {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const token = generateToken(user.id);
  const { googleId: _googleId, ...safeUser } = user;
  return {
    user: safeUser,
    token,
  };
}

export async function authenticateWithGoogle(credential: string) {
  if (!credential?.trim()) {
    throw new GoogleAuthError("Invalid Google credential");
  }

  const googleUser = await verifyGoogleCredential(credential.trim());

  const existingByGoogleId = await prisma.user.findUnique({
    where: { googleId: googleUser.googleId },
    select: userSelect,
  });

  if (existingByGoogleId) {
    const updated =
      !existingByGoogleId.avatarUrl && googleUser.avatarUrl
        ? await prisma.user.update({
            where: { id: existingByGoogleId.id },
            data: { avatarUrl: googleUser.avatarUrl },
            select: userSelect,
          })
        : existingByGoogleId;

    return toAuthResult(updated);
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email: googleUser.email },
    select: userSelect,
  });

  if (existingByEmail) {
    const linked = await prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        googleId: googleUser.googleId,
        emailVerified: true,
        ...(!existingByEmail.avatarUrl && googleUser.avatarUrl
          ? { avatarUrl: googleUser.avatarUrl }
          : {}),
      },
      select: userSelect,
    });

    return toAuthResult(linked);
  }

  const created = await prisma.user.create({
    data: {
      fullName: googleUser.fullName,
      email: googleUser.email,
      googleId: googleUser.googleId,
      avatarUrl: googleUser.avatarUrl,
      password: null,
      emailVerified: true,
    },
    select: userSelect,
  });

  await createDefaultCategoriesForUser(created.id);

  return toAuthResult(created);
}
