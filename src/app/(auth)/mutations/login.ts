import { resolver } from "@blitzjs/rpc"
import { AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { PasswordHash } from "../../lib/password"
import { Role } from "types"
import { rateLimit, resetRateLimit } from "../../lib/rateLimit"

const MAX_ATTEMPTS = 5
const WINDOW_MS = 60_000 // 5 attempts per minute, per email

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const result = await PasswordHash.verify(user.hashedPassword, password)
  if (result !== PasswordHash.VALID) throw new AuthenticationError()

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // Throttle brute-force attempts per email.
  const key = `login:${email.toLowerCase()}`
  const { ok, retryAfter } = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS)
  if (!ok) {
    throw new Error(`Too many login attempts. Please try again in ${retryAfter} second(s).`)
  }

  const user = await authenticateUser(email, password)
  // Successful login clears the counter.
  resetRateLimit(key)
  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})
