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
 */
export type RejectionReason = 'not-an-object' | 'honeypot' | 'name' | 'phone' | 'email'

export type ValidationResult =
  | { ok: true; data: SubmissionFields }
  | { ok: false; error: string; reason: RejectionReason }

/** Hidden field name. A real user never fills this; bots usually do. */
export const HONEYPOT_FIELD = 'company_website'

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

  // Honeypot: hidden from humans and screen readers. Anything here is a bot.
  const honeypot = raw[HONEYPOT_FIELD]
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return { ok: false, error: 'Your submission could not be processed.', reason: 'honeypot' }
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

  return { ok: true, data: { name, phone, email } }
}

/** Format 10- and 11-digit US numbers for display in the notification email. */
export function formatPhone(digits: string): string {
  const d = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  if (d.length !== 10) return digits
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}
