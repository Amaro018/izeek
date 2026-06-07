import { resolver } from "@blitzjs/rpc"
import db from "db"

// Admin-only: returns SMTP config including password for editing.
// Never expose this from a public query.
export default resolver.pipe(resolver.authorize(), async () => {
  const s = await db.emailSettings.findUnique({ where: { id: "default" } })
  return {
    host: s?.host ?? "",
    port: s?.port ?? 587,
    secure: s?.secure ?? false,
    user: s?.user ?? "",
    pass: s?.pass ?? "",
    fromName: s?.fromName ?? "",
    fromEmail: s?.fromEmail ?? "",
    contactTo: s?.contactTo ?? "",
  }
})
