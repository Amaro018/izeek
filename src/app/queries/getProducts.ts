// queries/getProducts.ts
import { Ctx } from "blitz"
import db from "db" // Assuming db is set up with Prisma

interface GetProductsInput {
  skip?: number
  take?: number
}

export default async function getProducts({ skip = 0, take = 10 }: GetProductsInput, ctx: Ctx) {
  ctx.session.$authorize() // Optional: Check if the user is authenticated, if needed

  const products = await db.product.findMany({
    skip,
    take,
    include: {
      category: true, // Include related category (adjust based on your schema)
    },
  })

  return products
}
