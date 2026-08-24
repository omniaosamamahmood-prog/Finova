import fs from "node:fs";
import path from "node:path";

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const AVATAR_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export const AVATARS_DIR = path.join(process.cwd(), "uploads", "avatars");

const AVATAR_URL_PREFIX = "/uploads/avatars/";

export function ensureAvatarsDir() {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

export function toAvatarUrl(filename: string) {
  return `${AVATAR_URL_PREFIX}${filename}`;
}

export function deleteAvatarFile(avatarUrl: string | null | undefined) {
  if (!avatarUrl || !avatarUrl.startsWith(AVATAR_URL_PREFIX)) {
    return;
  }

  const filename = path.basename(avatarUrl);
  const filePath = path.join(AVATARS_DIR, filename);

  if (!filePath.startsWith(AVATARS_DIR)) {
    return;
  }

  fs.unlink(filePath, () => undefined);
}
