export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = getAdminEmail();
  if (!adminEmail || !email) {
    return false;
  }

  return email.trim().toLowerCase() === adminEmail;
}
