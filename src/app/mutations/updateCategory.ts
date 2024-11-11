// app/categories/mutations/updateCategory.ts

import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

const UpdateCategory = z.object({
  id: z.number(),
  name: z.string().min(1),
  // Add other fields as necessary
})

export default resolver.pipe(
  resolver.zod(UpdateCategory),
  resolver.authorize(), // Add authorization as needed
  async ({ id, ...data }) => {
    const category = await db.category.update({
      where: { id },
      data,
    })

    return category
  }
)
