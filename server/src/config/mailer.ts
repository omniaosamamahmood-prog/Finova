import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`[email] Missing ${name}`);
    throw new Error("Email service is not configured");
  }
  return value;
}

export function getMailTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const host = requireEnv("SMTP_HOST");
  const portRaw = requireEnv("SMTP_PORT");
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");

  const port = Number(portRaw);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    console.error("[email] SMTP_PORT is invalid");
    throw new Error("Email service is not configured");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}
