import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to,
    subject: "Reset your password — School Directory Uganda",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1f4a3d;">Reset your password</h2>
        <p>We received a request to reset the password for your School Directory Uganda account.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #1f4a3d; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Reset password
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password won't be changed.
        </p>
      </div>
    `,
  });
}
