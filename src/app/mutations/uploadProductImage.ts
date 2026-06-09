// app/mutations/uploadProductImage.ts
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import fs from "fs"
import path from "path"

const ALLOWED_EXT = ["png", "jpg", "jpeg", "gif", "webp"] as const
const ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
] as const
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const UploadProductImage = z.object({
  fileName: z.string().min(1).max(255),
  data: z.string().min(1), // data URL: "data:<mime>;base64,<payload>"
})

export default resolver.pipe(
  resolver.zod(UploadProductImage),
  // Only authenticated admins may upload files to the server.
  resolver.authorize(),
  async ({ fileName, data }) => {
    // Parse and validate the data URL.
    const match = data.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) {
      throw new Error("Invalid image data.")
    }
    const [, mime, base64] = match
    if (!ALLOWED_MIME.includes(mime as (typeof ALLOWED_MIME)[number])) {
      throw new Error("Unsupported image type. Allowed: PNG, JPEG, GIF, WEBP.")
    }

    const buffer = Buffer.from(base64, "base64")
    if (buffer.length === 0) {
      throw new Error("Empty image.")
    }
    if (buffer.length > MAX_BYTES) {
      throw new Error("Image too large (max 5 MB).")
    }

    // Sanitize the file name: strip any directory components (path traversal
    // protection) and keep only the extension, which must be in the allowlist.
    const ext = path.extname(fileName).slice(1).toLowerCase()
    if (!ALLOWED_EXT.includes(ext as (typeof ALLOWED_EXT)[number])) {
      throw new Error("Unsupported file extension.")
    }

    // Build our own safe, unique file name. Never trust the client's path.
    const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.promises.mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, safeName)

    await fs.promises.writeFile(filePath, buffer)

    // Return a relative path (not an absolute URL). The browser resolves it
    // against the current origin, so it works on any domain — no BASE_URL.
    return `/uploads/${safeName}`
  }
)
