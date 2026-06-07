import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateEmailSettings = z.object({
  host: z.string().max(200).optional(),
  port: z.number().int().min(1).max(65535).optional(),
  secure: z.boolean().optional(),
  user: z.string().max(200).optional(),
  pass: z.string().max(500).optional(),
  fromName: z.string().max(120).optional(),
  fromEmail: z.string().max(200).optional(),
  contactTo: z.string().max(200).optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateEmailSettings),
  resolver.authorize(),
  async (data) => {
    await db.emailSettings.upsert({
      where: { id: "default" },
      create: { id: "default", ...data },
      update: data,
    })
    return true
  }
)
