import { Ctx } from "blitz"
import db from "db"

interface GetProductsInput {
  skip?: number
  take?: number
}

export default async function getProducts({ skip = 0, take = 10 }: GetProductsInput, ctx: Ctx) {
  // Allow guests to access products without authorization
  // Remove or comment out the authorization check if not needed
  // ctx.session.$authorize()

  const products = await db.product.findMany({
    skip,
    take,
    include: {
      category: true, // Ensure this matches your Prisma schema
    },
    orderBy: {
      createdAt: "desc", // Optionally order products by the newest first
    },
  })

  return products
}
