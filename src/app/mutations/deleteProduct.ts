// mutations/deleteProduct.ts
import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

const DeleteProduct = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteProduct),
  resolver.authorize(), // Authorization middleware
  async ({ id }) => {
    const product = await db.product.delete({
      where: { id },
    })
    return product
  }
)
