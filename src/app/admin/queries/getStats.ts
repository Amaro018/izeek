import { resolver } from "@blitzjs/rpc"
import db from "db"

const LOW_STOCK_THRESHOLD = 5

export default resolver.pipe(resolver.authorize(), async () => {
  const [productCount, categoryCount, lowStockCount, products] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.product.count({ where: { quantity: { lte: LOW_STOCK_THRESHOLD } } }),
    db.product.findMany({ select: { srp: true, quantity: true } }),
  ])

  // Total inventory value at SRP.
  const inventoryValue = products.reduce((sum, p) => sum + p.srp * p.quantity, 0)

  return { productCount, categoryCount, lowStockCount, inventoryValue }
})
