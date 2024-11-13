import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

// Define the schema for the update product input
const UpdateProductInput = z.object({
  id: z.number(),
  productName: z.string(),
  productDescription: z.string(),
  quantity: z.number(),
  srp: z.number(),
  sdp: z.number(),
  categoryId: z.number(),
  productImage: z.string().optional(),
})

// Define the mutation to update a product
const updateProduct = resolver.pipe(
  resolver.zod(UpdateProductInput), // Validates input based on UpdateProductInput schema
  resolver.authorize(), // Authorizes the request, customize based on your needs
  async ({ id, ...data }) => {
    const product = await db.product.update({
      where: { id },
      data,
    })
    return product
  }
)

export default updateProduct
