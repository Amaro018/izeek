import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProduct = z.object({ id: z.string() })

export default resolver.pipe(resolver.zod(GetProduct), resolver.authorize(), async ({ id }) => {
  const product = await db.product.findFirst({
    where: { id },
    include: { category: true },
  })
  if (!product) {
    throw new Error("Product not found")
  }
  return product
})
