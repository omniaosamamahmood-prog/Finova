import { getMailTransporter } from "../config/mailer.js";

const PRIMARY = "#3B82F6";

const FRIENDLY_EMAIL_ERRORS = new Set([
  "Email service is not configured",
  "Email sender is not verified",
  "Email could not be delivered to this address",
  "Failed to send email",
]);

function getFromAddress() {
  const from = process.env.EMAIL_FROM?.trim();
  if (!from) {
    console.error("[email] Missing EMAIL_FROM");
    throw new Error("Email service is not configured");
  }
  return from;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function baseLayout(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background:${PRIMARY};padding:20px 28px;">
              <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.04em;color:#ffffff;">FINOVA</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">
                If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${PRIMARY};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:10px;">${label}</a>`;
}

function describeSmtpError(error: unknown): string {
  if (error && typeof error === "object") {
    const smtpError = error as {
      message?: unknown;
      code?: unknown;
      command?: unknown;
      responseCode?: unknown;
      response?: unknown;
    };
    const parts: string[] = [];
    if (typeof smtpError.code === "string") {
      parts.push(`code=${smtpError.code}`);
    }
    if (typeof smtpError.command === "string") {
      parts.push(`command=${smtpError.command}`);
    }
    if (typeof smtpError.responseCode === "number") {
      parts.push(`responseCode=${smtpError.responseCode}`);
    }
    if (typeof smtpError.response === "string") {
      parts.push(smtpError.response);
    } else if (typeof smtpError.message === "string") {
      parts.push(smtpError.message);
    }
    if (parts.length > 0) {
      return parts.join(" | ");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to send email";
}

function mapSmtpFailure(error: unknown): Error {
  if (error instanceof Error && FRIENDLY_EMAIL_ERRORS.has(error.message)) {
    return error;
  }

  const details = describeSmtpError(error);
  console.error("[email] SMTP send failed:", details);

  const lower = details.toLowerCase();
  if (
    lower.includes("eauth") ||
    lower.includes("invalid login") ||
    lower.includes("authentication") ||
    lower.includes("credentials")
  ) {
    return new Error("Email service is not configured");
  }

  if (
    lower.includes("sender") ||
    lower.includes("from address") ||
    lower.includes("not allowed to send")
  ) {
    return new Error("Email sender is not verified");
  }

  if (
    lower.includes("recipient") ||
    lower.includes("user unknown") ||
    lower.includes("mailbox unavailable")
  ) {
    return new Error("Email could not be delivered to this address");
  }

  return new Error("Failed to send email");
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const from = getFromAddress();
    const transporter = getMailTransporter();

    await transporter.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  } catch (error) {
    throw mapSmtpFailure(error);
  }
}

export async function sendVerificationEmail(params: {
  to: string;
  fullName: string;
  verifyUrl: string;
}) {
  const safeName = escapeHtml(params.fullName);
  const safeUrl = escapeHtml(params.verifyUrl);

  const html = baseLayout(
    "Verify your email",
    `
      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#111827;">Verify your email</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
        Hi ${safeName}, welcome to Finova. Please verify your email address to activate your account.
      </p>
      <p style="margin:0 0 24px;">${ctaButton(params.verifyUrl, "Verify Email")}</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
        This link expires in 24 hours. If the button does not work, copy and paste this URL into your browser:<br/>
        <span style="word-break:break-all;color:#4b5563;">${safeUrl}</span>
      </p>
    `
  );

  await sendEmail({
    to: params.to,
    subject: "Verify your Finova email",
    html,
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  fullName: string;
  resetUrl: string;
}) {
  const safeName = escapeHtml(params.fullName);
  const safeUrl = escapeHtml(params.resetUrl);

  const html = baseLayout(
    "Reset your password",
    `
      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#111827;">Reset your password</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
        Hi ${safeName}, we received a request to reset your Finova password.
      </p>
      <p style="margin:0 0 24px;">${ctaButton(params.resetUrl, "Reset Password")}</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
        This link expires in 15 minutes. If you did not request a reset, ignore this email.<br/>
        <span style="word-break:break-all;color:#4b5563;">${safeUrl}</span>
      </p>
    `
  );

  await sendEmail({
    to: params.to,
    subject: "Reset your Finova password",
    html,
  });
}
