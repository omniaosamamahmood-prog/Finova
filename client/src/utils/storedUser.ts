import type { Profile } from "../types/api";

const USER_STORAGE_KEY = "user";

export function getStoredUser(): Partial<Profile> {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "{}") as Partial<
      Profile
    >;
  } catch {
    return {};
  }
}

export function persistStoredUser(profile: Profile) {
  localStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify({
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
      createdAt: profile.createdAt,
    })
  );
}
