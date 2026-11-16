/**
 * Server-side validation and sanitization for both form endpoints.
 *
 * The client validates too, for feedback -- but nothing here trusts it.
 * Every submission is re-parsed from the raw request body.
 */

/** Field set shared by both forms. */
export type SubmissionFields = {
  name: string
  phone: string
  email: string
}

/**
 * Why a submission was turned away. The `error` is for the person; this is
 * for the log. A rejection used to be silent, which meant a form that was
 * refusing every submission looked identical to a form nobody had used.
 *
 * Note what is NOT in this list: the honeypot. Tripping the trap is no longer
 * grounds for refusing anyone -- see `BotSignal`.
 */
export type RejectionReason = 'not-an-object' | 'name' | 'phone' | 'email'

/**
 * Evidence that a submission came from a machine. These are suspicions, not
 * verdicts, and nothing here refuses a submission on its own.
 *
 * `honeypot`     a field no human can see came back with something in it.
 * `fast-submit`  the form was filled and sent faster than a person can type.
 *
 * Both are client-reported and therefore forgeable, which is fine: they exist
 * to catch indiscriminate form fillers, not a determined attacker. A bot that
 * posts JSON straight at the endpoint trips neither, and never did -- the rate
 * limiter is what bounds that, not this.
 */
export type BotSignal = 'honeypot' | 'fast-submit'

export type ValidationResult =
  | { ok: true; data: SubmissionFields; signals: BotSignal[] }
  | { ok: false; error: string; reason: RejectionReason }

/**
 * The JSON key the trap's value arrives under.
 *
 * This is NOT the name of the input in the page, and the two must never be
 * unified again. The browser's autofill reads the DOM; this code reads the
 * JSON body. They are separate namespaces, and the client builds this payload
 * by hand, so the input can be called something meaningless in the markup
 * while the value still arrives here under a stable key.
 *
 * Collapsing the two is what broke the form. The input was called
 * `company_website`; Chrome's own field classifier matches `company` and
 * decided it was an organisation field, so it filled it from the user's saved
 * profile -- in an incognito window, with no extensions, for an ordinary
 * person doing nothing unusual. Every one of those submissions was refused as
 * a bot. The markup name now carries no word a classifier recognises.
 */
export const TRAP_VALUE_KEY = 'trap'

/** JSON key for milliseconds between the form appearing and being submitted. */
export const ELAPSED_KEY = 'elapsedMs'

/**
 * Below this, nobody typed a name, a telephone number and an email address.
 * Deliberately far below any plausible human time rather than close to it:
 * this only has to catch a script submitting instantly, and the cost of
 * misjudging a quick human is higher than the cost of missing a slow bot.
 */
const FAST_SUBMIT_MS = 1500

const MAX_NAME = 120
const MAX_EMAIL = 254
const MAX_PHONE_DIGITS = 15

/**
 * Deliberately conservative: one @, a dot-separated domain, no whitespace or
 * angle brackets. Rejects header-injection attempts as a side effect, since
 * this value is used as an email replyTo.
 */
const EMAIL_RE = /^[^\s@<>",;:\\]+@[^\s@<>",;:\\.]+(\.[^\s@<>",;:\\.]+)+$/

/** ASCII control characters, which have no place in a name or email. */
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

/** Strip control characters, collapse whitespace, trim, and bound the length. */
function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(CONTROL_CHARS, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Digits only. US numbers may arrive as "(858) 729-0003" or "+1 858...". */
export function normalizePhone(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\D/g, '').slice(0, MAX_PHONE_DIGITS)
}

export function isValidEmail(value: string): boolean {
  return value.length > 0 && value.length <= MAX_EMAIL && EMAIL_RE.test(value)
}

export function isValidPhone(digits: string): boolean {
  return digits.length >= 10
}

/**
 * Parse an unknown request body into a validated submission.
 * Returns a human-readable error -- never an internal detail.
 */
export function validateSubmission(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return {
      ok: false,
      error: 'We could not read that submission. Please try again.',
      reason: 'not-an-object',
    }
  }

  const raw = body as Record<string, unknown>

  // Gather suspicion, but do not act on it here. Collecting the evidence and
  // deciding what it is worth are separate jobs, and keeping them separate is
  // what lets the caller choose to accept a flagged submission rather than
  // throw it away.
  const signals: BotSignal[] = []

  const trap = raw[TRAP_VALUE_KEY]
  if (typeof trap === 'string' && trap.trim() !== '') signals.push('honeypot')

  const elapsed = raw[ELAPSED_KEY]
  if (typeof elapsed === 'number' && Number.isFinite(elapsed) && elapsed >= 0 && elapsed < FAST_SUBMIT_MS) {
    signals.push('fast-submit')
  }

  const name = clean(raw.name, MAX_NAME)
  if (name.length < 2) {
    return { ok: false, error: 'Please enter your full name.', reason: 'name' }
  }

  const phone = normalizePhone(raw.phone)
  if (!isValidPhone(phone)) {
    return {
      ok: false,
      error: 'Please enter a valid phone number with at least 10 digits.',
      reason: 'phone',
    }
  }

  const email = clean(raw.email, MAX_EMAIL).toLowerCase()
  if (!isValidEmail(email)) {
    return { ok: false, error: 'Please enter a valid email address.', reason: 'email' }
  }

  return { ok: true, data: { name, phone, email }, signals }
}

/** Format 10- and 11-digit US numbers for display in the notification email. */
export function formatPhone(digits: string): string {
  const d = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  if (d.length !== 10) return digits
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}
