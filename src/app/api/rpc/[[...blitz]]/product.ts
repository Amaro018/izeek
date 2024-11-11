// src/pages/api/products.ts
import formidable from "formidable"
import fs from "fs"
import path from "path"
import { withBlitzAuth } from "src/app/blitz-server" // Adjust path if necessary
import db from "db" // Import your Blitz/Prisma database instance

export const config = {
  api: {
    bodyParser: false, // Disabling Next.js body parsing because formidable handles it
  },
}

const uploadDir = path.join(process.cwd(), "public", "uploads") // Ensure the 'uploads' folder exists

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const handleProductCreation = withBlitzAuth(async (req, res) => {
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
          quantity: 0, // Default value or set accordingly
          categoryId: 1, // Default category or pass it as a form field
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
})

export default handleProductCreation
