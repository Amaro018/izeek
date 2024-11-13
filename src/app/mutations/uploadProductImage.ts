// app/mutations/uploadProductImage.ts
import { resolver } from "@blitzjs/rpc"
import fs from "fs"
import path from "path"

interface UploadProductImageInput {
  fileName: string
  data: string // Base64 data string
}

export default resolver.pipe(async ({ fileName, data }: UploadProductImageInput) => {
  const buffer = Buffer.from(data.split(",")[1], "base64") // Convert base64 to buffer
  const uniqueFileName = `${fileName}`
  const filePath = path.join(process.cwd(), "public", "uploads", uniqueFileName)

  // Save the file to the local filesystem
  await fs.promises.writeFile(filePath, buffer)

  // Construct the absolute URL
  const fileUrl = `${process.env.BASE_URL || "http://localhost:3000"}/uploads/${uniqueFileName}`

  return fileUrl // Return absolute URL
})
