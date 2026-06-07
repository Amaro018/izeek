import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateSiteSettings = z.object({
  phone: z.string().max(50).optional(),
  email: z.string().max(120).optional(),
  address: z.string().max(200).optional(),
  facebook: z.string().max(200).optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateSiteSettings),
  resolver.authorize(),
  async (data) => {
    return db.siteSettings.upsert({
      where: { id: "default" },
      create: { id: "default", ...data },
      update: data,
    })
  }
)
