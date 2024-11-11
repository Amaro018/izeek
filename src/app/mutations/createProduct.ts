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
      categoryId: z.number().int().min(1),
      productImage: z.string().url().optional(),
    })
  ),
  resolver.authorize(),
  async (
    { productName, productDescription, quantity, srp, sdp, categoryId, productImage },
    ctx
  ) => {
    const product = await db.product.create({
      data: {
        productName,
        productDescription,
        quantity,
        srp,
        sdp,
        categoryId: parseInt(categoryId),
        productImage, // The image URL from the file upload
      },
    })

    return product
  }
)
