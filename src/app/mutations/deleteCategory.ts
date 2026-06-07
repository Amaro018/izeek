// app/categories/mutations/deleteCategory.ts

import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

// Define input validation schema
const DeleteCategory = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteCategory),
  resolver.authorize(), // Add authorization as needed
  async ({ id }) => {
    // Deleting a category cascade-deletes all of its products. Block the
    // delete while products still reference it so they aren't silently lost.
    const productCount = await db.product.count({ where: { categoryId: id } })
    if (productCount > 0) {
      throw new Error(
        `Cannot delete: ${productCount} product(s) still use this category. Move or delete them first.`
      )
    }

    const category = await db.category.delete({
      where: { id },
    })

    return category
  }
)
