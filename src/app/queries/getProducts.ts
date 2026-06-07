import { Ctx } from "blitz"
import db from "db"
import { Prisma } from "@prisma/client"

interface GetProductsInput {
  skip?: number
  take?: number
  search?: string
  categoryId?: string
}

export default async function getProducts(
  { skip = 0, take = 10, search, categoryId }: GetProductsInput,
  ctx: Ctx
) {
  // Public query: guests may browse products, so no authorization check.
  const where: Prisma.ProductWhereInput = {
    ...(search ? { productName: { contains: search } } : {}),
    ...(categoryId && categoryId !== "all" ? { categoryId } : {}),
  }

  const products = await db.product.findMany({
    where,
    skip,
    take,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return products
}
