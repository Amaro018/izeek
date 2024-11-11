// app/categories/mutations/deleteCategory.ts

import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

// Define input validation schema
const DeleteCategory = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteCategory),
  resolver.authorize(), // Add authorization as needed
  async ({ id }) => {
    // Delete the category with the provided ID
    const category = await db.category.delete({
      where: { id },
    })

    return category
  }
)
