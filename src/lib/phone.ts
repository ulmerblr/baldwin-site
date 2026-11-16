/**
 * Phone number parsing, for both forms.
 *
 * SCOPE. Format only. Nothing here asks whether a number is connected, or
 * whose it is -- no lookup, no carrier API, no verification code. The question
 * this file answers is narrower: could this string be a telephone number at
 * all, and if it could, is there anything about it worth a second look.
 *
 * POSTURE. The same one the honeypot settled on. A false positive destroys a
 * prospect; a false negative costs Chris a few seconds on a call he was going
 * to make anyway. So the bar for refusing someone is "this cannot be a phone
 * number", not "this looks wrong to me". Everything merely odd is accepted,
 * delivered, and flagged for his judgement -- because he is going to dial it,
 * and dialling it is the only verification that was ever going to be real.
 */

/** Why a number could not be a number at all. Each maps to its own message. */
export type PhoneRejection = 'empty' | 'not-a-number' | 'too-short' | 'too-long' | 'area-code' | 'exchange-code'

/**
 * Why a number is worth a second look. None of these refuses anyone.
 *
 * `repeated-digits`   all ten the same, e.g. 6666666666
 * `sequential-digits` a straight run up or down, e.g. 9876543210
 * `fictional-555`     the 555-0100..555-0199 block reserved for fiction
 * `non-us-number`     parses as a phone number, but not a North American one
 */
export type PhoneFlag = 'repeated-digits' | 'sequential-digits' | 'fictional-555' | 'non-us-number'

export type PhoneResult =
  | { ok: true; digits: string; ext: string; flags: PhoneFlag[] }
  | { ok: false; error: string; rejection: PhoneRejection }

/**
 * THE MESSAGES. Specific, and blameless. A person who mistyped their own
 * number needs to know which part to look at; "invalid input" tells them
 * nothing and reads as an accusation. None of these says the person did
 * something wrong, and all of them say what to do next.
 */
const MESSAGES: Record<PhoneRejection, string> = {
  empty: 'Please enter your phone number.',
  'not-a-number': "That doesn't look like a phone number — please check it.",
  'too-short': "That phone number doesn't look complete — please check it.",
  'too-long': 'That phone number has more digits than we expected — please check it.',
  'area-code': "That doesn't look like a valid US area code — please check the first three digits.",
  'exchange-code': "That doesn't look like a valid US number — please check the digits after the area code.",
}

export function phoneMessage(rejection: PhoneRejection): string {
  return MESSAGES[rejection]
}

/** E.164 allows at most fifteen digits, country code included. */
const MAX_DIGITS = 15
/** Below this nothing is dialable anywhere, even as a local number. */
const MIN_INTERNATIONAL_DIGITS = 7

/**
 * An extension, written any of the ways people write one. Captured rather than
 * discarded: Chris needs it to reach them, and silently dropping it would turn
 * a reachable number into one that rings a switchboard forever.
 */
const EXTENSION_RE = /[,;]?\s*(?:ext(?:ension)?\.?|x)\s*[:.]?\s*(\d{1,6})\s*$/i

/**
 * What a person may legitimately type around the digits: spaces, brackets,
 * dashes, dots, a leading plus. Anything else -- letters, say -- means this is
 * not a phone number being typed, and that is one of the few things worth
 * refusing outright.
 */
const FORMATTING_ONLY = /^[0-9()\-.\s+/]*$/

function isRepeated(d: string): boolean {
  return d.split('').every((c) => c === d[0])
}

function isSequential(d: string): boolean {
  const up = d.split('').every((c, i) => i === 0 || Number(c) === (Number(d[i - 1]) + 1) % 10)
  const down = d.split('').every((c, i) => i === 0 || Number(c) === (Number(d[i - 1]) + 9) % 10)
  return up || down
}

/**
 * Parse a raw phone field.
 *
 * NANP rules applied to North American numbers, and only the ones that are
 * genuine impossibilities rather than merely unusual: neither the area code
 * nor the exchange code may begin with 0 or 1, and no area code takes the
 * N11 form (211, 311, ... 911), which is reserved for services and is not
 * assignable. Those cannot be anybody's number. Everything else that parses
 * is somebody's number until proven otherwise.
 */
export function parsePhone(value: unknown): PhoneResult {
  if (typeof value !== 'string' || value.trim() === '') {
    return { ok: false, error: MESSAGES.empty, rejection: 'empty' }
  }

  const trimmed = value.trim()

  // Peel the extension off before anything else, so its digits never get
  // counted as part of the number.
  const extMatch = trimmed.match(EXTENSION_RE)
  const ext = extMatch ? extMatch[1] : ''
  const numberPart = (extMatch ? trimmed.slice(0, extMatch.index) : trimmed).trim()

  if (!FORMATTING_ONLY.test(numberPart)) {
    return { ok: false, error: MESSAGES['not-a-number'], rejection: 'not-a-number' }
  }

  const digits = numberPart.replace(/\D/g, '')
  if (digits.length === 0) {
    return { ok: false, error: MESSAGES['not-a-number'], rejection: 'not-a-number' }
  }
  if (digits.length > MAX_DIGITS) {
    return { ok: false, error: MESSAGES['too-long'], rejection: 'too-long' }
  }

  // A plus is how somebody says "this is an international number". Honour it.
  const explicitlyInternational = numberPart.startsWith('+')
  const looksNorthAmerican =
    digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))

  if (!looksNorthAmerican) {
    // Not a NANP shape. It may still be perfectly good -- the site reads as
    // national but Chris writes in several states and people travel -- so the
    // only question is whether it is long enough to be a number anywhere.
    if (digits.length < MIN_INTERNATIONAL_DIGITS) {
      return { ok: false, error: MESSAGES['too-short'], rejection: 'too-short' }
    }
    if (!explicitlyInternational && digits.length < 10) {
      // Nine digits or fewer with no country code, on a US-facing form: far
      // more likely a dropped digit than a foreign number typed bare.
      return { ok: false, error: MESSAGES['too-short'], rejection: 'too-short' }
    }
    return { ok: true, digits, ext, flags: ['non-us-number'] }
  }

  const national = digits.length === 11 ? digits.slice(1) : digits
  const npa = national.slice(0, 3)
  const nxx = national.slice(3, 6)

  if (npa[0] === '0' || npa[0] === '1') {
    return { ok: false, error: MESSAGES['area-code'], rejection: 'area-code' }
  }
  if (npa[1] === '1' && npa[2] === '1') {
    // 211, 311, 411 ... 911. Service codes, never assignable as area codes.
    return { ok: false, error: MESSAGES['area-code'], rejection: 'area-code' }
  }
  if (nxx[0] === '0' || nxx[0] === '1') {
    return { ok: false, error: MESSAGES['exchange-code'], rejection: 'exchange-code' }
  }

  const flags: PhoneFlag[] = []
  if (isRepeated(national)) flags.push('repeated-digits')
  else if (isSequential(national)) flags.push('sequential-digits')
  if (nxx === '555' && national.slice(6, 8) === '01') flags.push('fictional-555')

  return { ok: true, digits: national, ext, flags }
}

/**
 * Render a stored number for the notification email.
 *
 * North American numbers get the familiar shape. Anything else is rendered in
 * E.164 with a leading plus, which is what makes it dialable from here --
 * including a foreign number somebody typed without one.
 */
export function formatPhone(digits: string, ext = ''): string {
  const d = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  const base = d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : `+${digits}`
  return ext ? `${base} ext. ${ext}` : base
}
