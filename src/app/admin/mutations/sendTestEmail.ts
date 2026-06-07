import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import { sendMail } from "../../lib/mailer"

const SendTestEmail = z.object({
  to: z.string().email(),
})

export default resolver.pipe(resolver.zod(SendTestEmail), resolver.authorize(), async ({ to }) => {
  await sendMail({
    to,
    subject: "i-Zeek test email",
    html: `<p>This is a test email from your i-Zeek admin panel. If you received this, SMTP is configured correctly.</p>`,
  })
  return true
})
