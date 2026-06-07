// Simple in-memory sliding-window rate limiter.
// Note: state lives in the process memory, so it resets on restart and is not
// shared across multiple server instances. For a single-instance deployment
// (and dev) this is enough; use Redis/Upstash if you scale horizontally.

type Timestamps = number[]
const store = new Map<string, Timestamps>()

export type RateLimitResult = { ok: boolean; retryAfter: number }

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs)

  if (hits.length >= limit) {
    const oldest = hits[0]
    const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000)
    store.set(key, hits)
    return { ok: false, retryAfter }
  }

  hits.push(now)
  store.set(key, hits)
  return { ok: true, retryAfter: 0 }
}

// Clear a key, e.g. after a successful login.
export function resetRateLimit(key: string) {
  store.delete(key)
}
