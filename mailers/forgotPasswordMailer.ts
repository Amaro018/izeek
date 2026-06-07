import { sendMail } from "../src/app/lib/mailer"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  const origin =
    process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN || "http://localhost:3000"
  const resetUrl = `${origin}/reset-password?token=${token}`

  const html = `
    <h1>Reset Your Password</h1>
    <p>Click the link below to set a new password. This link expires in 4 hours.</p>
    <p><a href="${resetUrl}">Reset my password</a></p>
    <p>If you didn't request this, you can ignore this email.</p>
  `

  return {
    async send() {
      // Sends via the SMTP settings configured in Admin → Email.
      await sendMail({ to, subject: "Your Password Reset Instructions", html })
    },
  }
}
