"use client"
import formidable from "formidable"
import fs from "fs"
import path from "path"
import db from "db" // Import your Blitz/Prisma database instance

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing so we can use formidable
  },
}

const uploadDir = path.join(process.cwd(), "public", "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const handleProductCreation = async (req, res) => {
  // Check if the method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" })
  }

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ success: false, message: "Error uploading file" })
    }

    const { productName } = fields
    const productImage = files.productImage?.[0]?.filepath
      ? `/uploads/${path.basename(files.productImage[0].filepath)}`
      : null

    try {
      const product = await db.product.create({
        data: {
          productName,
          productImage,
          quantity: 0, // Default value or adjust accordingly
          categoryId: 1, // Default category or pass it from the form
          srp: 0.0, // Add these fields based on your form setup
          sdp: 0.0,
        },
      })

      res.status(200).json({ success: true, message: "Product created successfully", product })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: "Error saving product" })
    }
  })
}

export default handleProductCreation
