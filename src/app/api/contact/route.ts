import { NextRequest, NextResponse } from "next/server"
import { sendMail, getContactRecipient } from "../../lib/mailer"
import { rateLimit } from "../../lib/rateLimit"

export async function POST(req: NextRequest) {
  // Rate limit by client IP: 3 messages per minute.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  const { ok, retryAfter } = rateLimit(`contact:${ip}`, 3, 60_000)
  if (!ok) {
    return NextResponse.json(
      { success: false, error: `Too many messages. Try again in ${retryAfter}s.` },
      { status: 429 }
    )
  }

  let body: { name?: string; email?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 })
  }

  const name = (body.name || "").trim()
  const email = (body.email || "").trim()
  const message = (body.message || "").trim()

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, error: "Name, email, and message are required." },
      { status: 400 }
    )
  }

  const to = await getContactRecipient()
  if (!to) {
    return NextResponse.json(
      { success: false, error: "Contact email is not configured yet." },
      { status: 503 }
    )
  }

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  const html = `
    <h2>New contact message</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${esc(message).replace(/\n/g, "<br/>")}</p>
  `

  try {
    await sendMail({
      to,
      subject: `New contact message from ${name}`,
      html,
      replyTo: email,
    })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to send message." },
      { status: 500 }
    )
  }
}
