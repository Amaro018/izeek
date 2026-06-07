import nodemailer from "nodemailer"
import db from "db"

export type MailInput = {
  to: string
  subject: string
  html: string
  replyTo?: string
}

async function getSettings() {
  return db.emailSettings.findUnique({ where: { id: "default" } })
}

export async function isEmailConfigured() {
  const s = await getSettings()
  return Boolean(s?.host && s?.user && s?.pass && s?.fromEmail)
}

// Recipient for the public contact form.
export async function getContactRecipient() {
  const s = await getSettings()
  return s?.contactTo || s?.fromEmail || null
}

export async function sendMail({ to, subject, html, replyTo }: MailInput) {
  const s = await getSettings()
  if (!s?.host || !s?.user || !s?.pass || !s?.fromEmail) {
    throw new Error("Email is not configured. Set SMTP details in Admin → Email.")
  }

  const transporter = nodemailer.createTransport({
    host: s.host.trim(),
    port: s.port,
    secure: s.secure, // true for 465, false for 587/STARTTLS
    // Gmail app passwords are shown with spaces ("abcd efgh ...") — strip them.
    auth: { user: s.user.trim(), pass: s.pass.replace(/\s+/g, "") },
  })

  const from = s.fromName ? `"${s.fromName}" <${s.fromEmail}>` : s.fromEmail

  await transporter.sendMail({ from, to, subject, html, replyTo })
}
