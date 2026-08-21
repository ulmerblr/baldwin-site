/**
 * In-memory, per-IP fixed-window rate limiter.
 *
 * Why in-memory rather than Redis/Upstash: this site takes a handful of
 * submissions a day. A shared store would add a network dependency, a second
 * failure mode, and another set of credentials to the one thing this site has
 * to do reliably -- deliver two forms. The honest trade-off is that serverless
 * instances are ephemeral and can scale out, so a determined attacker spread
 * across cold starts gets more than `limit` requests. This is a speed bump for
 * casual abuse and runaway retry loops, not a security control; the honeypot
 * and server-side validation do the actual filtering.
 *
 * If volume ever justifies it, swap the body of `rateLimit()` for a shared
 * store -- the call signature is all the handlers depend on.
 */

type Window = { count: number; resetAt: number }

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const LIMIT = 5 // submissions per IP per window
const MAX_TRACKED_IPS = 10_000 // bound memory against a spray of unique IPs

const windows = new Map<string, Window>()

/** Drop expired entries so the map does not grow without bound. */
function sweep(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key)
  }
}

export type RateLimitResult = {
  allowed: boolean
  /** Seconds until the caller may retry. Only meaningful when blocked. */
  retryAfter: number
}

export function rateLimit(
  ip: string,
  { limit = LIMIT, windowMs = WINDOW_MS }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now()
  const existing = windows.get(ip)

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_IPS) sweep(now)
    // Still full after sweeping means we are under a distributed spray.
    // Fail open: a legitimate submission matters more than a perfect limit.
    if (windows.size >= MAX_TRACKED_IPS) return { allowed: true, retryAfter: 0 }

    windows.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) }
  }

  existing.count += 1
  return { allowed: true, retryAfter: 0 }
}

/**
 * Best-effort client IP.
 *
 * On Vercel, `x-forwarded-for` is set by the platform edge and the left-most
 * entry is the real client. Off-platform the header is spoofable, which is
 * another reason this limiter is a speed bump rather than a control.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip')?.trim() || 'unknown'
}

/** Test seam: clear all tracked windows. */
export function resetRateLimits(): void {
  windows.clear()
}
