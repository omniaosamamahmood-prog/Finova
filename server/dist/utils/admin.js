export function getAdminEmail() {
    return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}
export function isAdminEmail(email) {
    const adminEmail = getAdminEmail();
    if (!adminEmail || !email) {
        return false;
    }
    return email.trim().toLowerCase() === adminEmail;
}
//# sourceMappingURL=admin.js.map