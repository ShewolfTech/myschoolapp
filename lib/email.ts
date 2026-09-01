import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
const APP_NAME = "My School App";

function shell(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1f4a3d;">${title}</h2>
      ${bodyHtml}
    </div>
  `;
}

function button(url: string, label: string): string {
  return `
    <p>
      <a href="${url}" style="display: inline-block; background: #1f4a3d; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
        ${label}
      </a>
    </p>
  `;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Reset your password — ${APP_NAME}`,
    html: shell(
      "Reset your password",
      `
        <p>We received a request to reset the password for your ${APP_NAME} account.</p>
        ${button(resetUrl, "Reset password")}
        <p style="color: #666; font-size: 14px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password won't be changed.
        </p>
      `
    ),
  });
}

export async function sendActivationEmail(to: string, activationUrl: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Confirm your email — ${APP_NAME}`,
    html: shell(
      "Confirm your email address",
      `
        <p>Thanks for signing up for ${APP_NAME}! Please confirm your email address to unlock all features.</p>
        ${button(activationUrl, "Confirm email")}
        <p style="color: #666; font-size: 14px;">
          This link expires in 24 hours. If you didn't create this account, you can ignore this email.
        </p>
      `
    ),
  });
}

export async function sendPasswordChangedEmail(to: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your password was changed — ${APP_NAME}`,
    html: shell(
      "Your password was changed",
      `
        <p>This is a confirmation that the password for your ${APP_NAME} account was just changed.</p>
        <p style="color: #666; font-size: 14px;">
          If this wasn't you, please contact us immediately and reset your password right away.
        </p>
      `
    ),
  });
}

export async function sendNewSchoolNotificationToAdmins(
  adminEmails: string[],
  schoolName: string,
  reviewUrl: string
) {
  if (adminEmails.length === 0) return;
  await resend.emails.send({
    from: FROM,
    to: adminEmails,
    subject: `New school submitted for review — ${schoolName}`,
    html: shell(
      "A new school is awaiting review",
      `
        <p><strong>${schoolName}</strong> was just submitted and needs your review.</p>
        ${button(reviewUrl, "Review submission")}
      `
    ),
  });
}

export async function sendSchoolApprovedEmail(
  to: string,
  schoolName: string,
  schoolUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `${schoolName} is now live — ${APP_NAME}`,
    html: shell(
      "Your school listing is approved!",
      `
        <p><strong>${schoolName}</strong> has been approved and is now visible to parents searching ${APP_NAME}.</p>
        ${button(schoolUrl, "View your listing")}
      `
    ),
  });
}

export async function sendSchoolRejectedEmail(
  to: string,
  schoolName: string,
  reason: string,
  editUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `${schoolName} needs changes — ${APP_NAME}`,
    html: shell(
      "Your school submission needs changes",
      `
        <p><strong>${schoolName}</strong> wasn't approved yet. Here's why:</p>
        <p style="background: #f6f2e6; border-left: 3px solid #a63a2e; padding: 12px 16px; color: #333;">
          ${reason}
        </p>
        <p>Please make the necessary changes and resubmit.</p>
        ${button(editUrl, "Edit and resubmit")}
      `
    ),
  });
}
