import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateProfile = z.object({
  name: z.string().max(100).optional(),
  email: z
    .string()
    .email()
    .transform((s) => s.toLowerCase().trim()),
})

export default resolver.pipe(
  resolver.zod(UpdateProfile),
  resolver.authorize(),
  async ({ name, email }, ctx) => {
    const userId = ctx.session.userId as string

    // Email is unique — block if another user already owns it.
    const existing = await db.user.findFirst({
      where: { email, id: { not: userId } },
    })
    if (existing) {
      throw new Error("That email is already in use.")
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { name: name?.trim() || null, email },
      select: { id: true, name: true, email: true, role: true },
    })

    return user
  }
)
