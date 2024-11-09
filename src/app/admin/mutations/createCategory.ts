// app/categories/mutations/createCategory.ts

import { Ctx } from "blitz"
import db from "db" // The Prisma client instance
import { z } from "zod"

// Define the input validation schema using Zod (optional but recommended)
const CreateCategory = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters long")
    .max(100, "Category name is too long"),
})

export default async function createCategory(input: { name: string }, ctx: Ctx) {
  // Input validation
  const { name } = CreateCategory.parse(input)

  // You can add user-specific checks here (for example, only admins can create categories)
  if (!ctx.session.userId) {
    throw new Error("You must be logged in to create a category.")
  }

  // Create the category in the database
  const category = await db.category.create({
    data: {
      name,
    },
  })

  return category
}
