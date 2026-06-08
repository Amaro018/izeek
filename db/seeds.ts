import db from "./index"
import { PasswordHash } from "../src/app/lib/password"

const seed = async () => {
  // scrypt hash of "password123" (regenerated each seed run so it stays in sync
  // with the PasswordHash scheme; replaces the old sodium/argon2 hash).
  const hashedPassword = await PasswordHash.hash("password123")

  const existingUser = await db.user.findFirst({
    where: {
      email: "admin@admin.com",
    },
  })

  if (!existingUser) {
    await db.user.create({
      data: {
        name: "Administrator",
        email: "admin@admin.com",
        role: "ADMIN",
        hashedPassword,
      },
    })
  } else {
    // Reset the seeded admin's password to the scrypt hash so the old
    // argon2 hash (unverifiable without sodium-native) is replaced.
    await db.user.update({
      where: { id: existingUser.id },
      data: { hashedPassword },
    })
  }

  // Seed default categories
  const defaultCategories = ["CCTV", "DVR", "HDD"]
  for (const name of defaultCategories) {
    const existing = await db.category.findUnique({ where: { name } })
    if (!existing) {
      await db.category.create({ data: { name } })
    }
  }

  console.log("Seed completed!")
}

export default seed
