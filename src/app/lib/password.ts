import { scrypt, randomBytes, timingSafeEqual } from "crypto"
import { promisify } from "util"

// Pure Node-core password hashing (scrypt). Replaces @blitzjs/auth's
// SecurePassword, which depends on the native `sodium-native` module — its
// prebuilt binary is glibc-only and segfaults on Alpine/musl at runtime
// (crashed the server on every login). crypto.scrypt has no native deps.

const scryptAsync = promisify(scrypt)
const KEYLEN = 64
const SCHEME = "scrypt"

export const PasswordHash = {
  VALID: "VALID" as const,
  INVALID: "INVALID" as const,
  VALID_NEEDS_REHASH: "VALID_NEEDS_REHASH" as const,

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex")
    const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer
    return `${SCHEME}$${salt}$${derived.toString("hex")}`
  },

  async verify(stored: string, password: string): Promise<"VALID" | "INVALID"> {
    try {
      const [scheme, salt, hashHex] = stored.split("$")
      if (scheme !== SCHEME || !salt || !hashHex) return "INVALID"
      const expected = Buffer.from(hashHex, "hex")
      const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer
      if (expected.length !== derived.length) return "INVALID"
      return timingSafeEqual(expected, derived) ? "VALID" : "INVALID"
    } catch {
      return "INVALID"
    }
  },
}
