// mutations/createProduct.ts
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

export default resolver.pipe(
  resolver.zod(
    z.object({
      productName: z.string().min(1),
      productDescription: z.string().min(1),
      quantity: z.number().int().min(0),
      srp: z.number().min(0),
      sdp: z.number().min(0),
      categoryId: z.string(),
      productImage: z.string().url().optional(),
    })
  ),
  resolver.authorize(),
  async (
    { productName, productDescription, quantity, srp, sdp, categoryId, productImage },
    ctx
  ) => {
    // A product cannot exist without a category. Make sure at least one
    // category exists and that the chosen category is valid.
    const categoryCount = await db.category.count()
    if (categoryCount === 0) {
      throw new Error("No categories exist. Create a category before adding a product.")
    }

    const category = await db.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      throw new Error("Selected category does not exist.")
    }

    const product = await db.product.create({
      data: {
        productName,
        productDescription,
        quantity,
        srp,
        sdp,
        categoryId,
        productImage, // The image URL from the file upload
      },
    })

    return product
  }
)
