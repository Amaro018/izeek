import db from "db"

export default async function getCategories() {
  try {
    return await db.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw new Error("Failed to fetch categories")
  }
}
