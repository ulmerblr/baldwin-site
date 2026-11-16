'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { site } from '@/content/site'
import { ELAPSED_KEY, TRAP_VALUE_KEY } from '@/lib/validate'
import { LicenseLine } from './license-line'

/**
 * THE TRAP'S NAME. It is random, it changes every visit, and it means nothing.
 *
 * The previous name was `company_website`. That contains the word `company`,
 * which is exactly what Chrome's own field classifier looks for when deciding
 * which input holds an organisation, so Chrome filled it from the user's saved
 * profile -- in an incognito window, with no extensions, for someone doing
 * nothing unusual -- and every one of those submissions was refused as a bot.
 * The opt-out attributes added for password managers did not help, because
 * Chrome honours none of them once it believes it has recognised a field.
 *
 * There is no attribute that reliably says "do not fill this". The only thing
 * that works is leaving nothing to recognise: no label, no placeholder, no
 * aria-label, and a name that is not a word. Randomising it per visit also
 * means no stable field signature for a browser to accumulate predictions
 * against, and nothing for a bot to special-case.
 *
 * It has to reach the element as a React prop. React manages `name` on an
 * input itself -- it clears and restores the property while syncing value --
 * so a name assigned imperatively is wiped on the next render, which here
 * meant the first keystroke. And a random value produced during render would
 * differ between the server and the browser, which is a hydration mismatch.
 * `useSyncExternalStore` is the sanctioned way out of that corner: the server
 * renders one constant, the browser swaps in its own value at hydration, and
 * React treats the difference as expected rather than as a bug.
 */

/** The name never changes once set, so there is nothing to subscribe to. */
const subscribeToNothing = () => () => {}

/** Generated once per page load, in the browser only. */
let browserTrapName = ''
function readBrowserTrapName(): string {
  if (!browserTrapName) browserTrapName = `f${Math.random().toString(36).slice(2, 10)}`
  return browserTrapName
}

/** What the server renders, until hydration replaces it. Equally meaningless. */
const SERVER_TRAP_NAME = 'f0'
const readServerTrapName = () => SERVER_TRAP_NAME

type Status = 'idle' | 'submitting' | 'success' | 'error'

type FieldName = 'name' | 'phone' | 'email'

type Values = Record<FieldName, string>

type Errors = Partial<Record<FieldName, string>>

type LeadFormProps = {
  endpoint: '/api/quote' | '/api/apply'
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successBody: string
  onDone: () => void
}

const EMAIL_RE = /^[^\s@<>",;:\\]+@[^\s@<>",;:\\.]+(\.[^\s@<>",;:\\.]+)+$/

/**
 * Client-side validation exists for fast feedback only. The server re-validates
 * every field from the raw body and is the authority -- see src/lib/validate.ts.
 */
function validate(values: Values): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (values.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Please enter a valid phone number with at least 10 digits.'
  }
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  return errors
}

const FIELDS: Array<{
  name: FieldName
  label: string
  type: string
  autoComplete: string
  inputMode?: 'text' | 'tel' | 'email'
}> = [
  { name: 'name', label: site.forms.fields.name, type: 'text', autoComplete: 'name' },
  { name: 'phone', label: site.forms.fields.phone, type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  { name: 'email', label: site.forms.fields.email, type: 'email', autoComplete: 'email', inputMode: 'email' },
]

export function LeadForm({
  endpoint,
  submitLabel,
  submittingLabel,
  successTitle,
  successBody,
  onDone,
}: LeadFormProps) {
  const formId = useId()
  const [values, setValues] = useState<Values>({ name: '', phone: '', email: '' })
  // The trap is deliberately uncontrolled -- no value, no onChange, no state.
  // React must not manage this input. A controlled one is re-rendered every
  // time the user types, and React wipes attributes it did not set itself on
  // the way through, which silently stripped the random name off the field
  // after the first keystroke. Leaving it alone keeps the name for the life of
  // the page, and its value is read straight off the element at submit.
  const trapRef = useRef<HTMLInputElement>(null)
  const trapName = useSyncExternalStore(subscribeToNothing, readBrowserTrapName, readServerTrapName)
  /** When this form appeared, set on mount. Zero until then, which flags nothing. */
  const shownAt = useRef(0)

  useEffect(() => {
    shownAt.current = Date.now()
  }, [])
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [formError, setFormError] = useState('')

  function setField(name: FieldName, value: string) {
    const next = { ...values, [name]: value }
    setValues(next)
    // Only re-validate a field the user has already left, so we are not
    // yelling at someone mid-typing.
    if (touched[name]) setErrors(validate(next))
  }

  function onBlur(name: FieldName) {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(values))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, phone: true, email: true })
    if (Object.keys(found).length > 0) return

    setStatus('submitting')
    setFormError('')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          // Seam: `resumeUrl` joins this payload when upload ships. Nothing
          // else in this handler changes.
          //
          // These two keys are fixed and have nothing to do with what the trap
          // input is called in the markup -- that name is random. The server
          // reads JSON, the browser's autofill reads the DOM; keeping the two
          // namespaces apart is the entire fix.
          [TRAP_VALUE_KEY]: trapRef.current?.value ?? '',
          [ELAPSED_KEY]: Date.now() - shownAt.current,
          // shownAt is 0 only if the effect has not run, which makes the
          // elapsed value enormous and flags nothing. Failing open is correct
          // here: a missing signal must never cost somebody their enquiry.
        }),
      })

      let payload: { ok?: boolean; error?: string } = {}
      try {
        payload = await response.json()
      } catch {
        // Non-JSON response (proxy error page, gateway timeout). Treated as a
        // failure -- never as an optimistic success.
      }

      if (response.ok && payload.ok === true) {
        setStatus('success')
        return
      }

      setStatus('error')
      setFormError(payload.error || site.forms.genericError)
    } catch {
      // Network failure mid-submit: offline, DNS, connection reset. The user
      // must see this rather than a blank modal.
      setStatus('error')
      setFormError(
        `We could not reach the server. Check your connection and try again, or call us at ${site.contact.phone}.`,
      )
    }
  }

  if (status === 'success') {
    return (
      <div>
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-gold/50 bg-gold-wash p-5"
        >
          <p className="font-semibold text-gold-deep">{successTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-body">{successBody}</p>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="mt-5 w-full rounded-xl bg-gold-bright px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold"
        >
          Close
        </button>
      </div>
    )
  }

  const busy = status === 'submitting'

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="space-y-4">
        {FIELDS.map((field) => {
          const fieldId = `${formId}-${field.name}`
          const errorId = `${fieldId}-error`
          const invalid = Boolean(touched[field.name] && errors[field.name])

          return (
            <div key={field.name}>
              <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-body">
                {field.label}
              </label>
              <input
                id={fieldId}
                name={field.name}
                type={field.type}
                inputMode={field.inputMode}
                autoComplete={field.autoComplete}
                required
                disabled={busy}
                value={values[field.name]}
                onChange={(e) => setField(field.name, e.target.value)}
                onBlur={() => onBlur(field.name)}
                aria-invalid={invalid}
                aria-describedby={invalid ? errorId : undefined}
                className={`w-full rounded-xl border bg-paper px-4 py-3 text-ink placeholder:text-muted disabled:opacity-60 ${
                  invalid ? 'border-red-500' : 'border-line'
                }`}
              />
              {invalid && (
                <p id={errorId} className="mt-1.5 text-sm text-red-700">
                  {errors[field.name]}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Honeypot: hidden from sighted users and removed from the a11y tree. */}
      {/* The trap.
          Nothing here carries a word an autofiller can recognise: no label
          text, no placeholder, no aria-label, and a random name. That is what
          keeps real people out of it -- the opt-out attributes below are
          belt-and-braces for extensions, and are not what does the work, since
          Chrome honours none of them once it thinks it has recognised a field.
          It stays out of reach of anyone browsing: off-screen and transparent
          by CSS, removed from the tab order, and inside an aria-hidden wrapper
          so screen readers never reach it either.
          A value arriving here now flags a submission rather than refusing it.
          Losing a prospect costs the agency far more than a junk email does. */}
      <div className="honeypot" aria-hidden="true">
        <input
          ref={trapRef}
          id={`${formId}-t`}
          type="text"
          name={trapName}
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore=""
          data-lpignore="true"
          data-bwignore=""
          data-form-type="other"
          defaultValue=""
        />
      </div>

      {/* Status region. Present in the DOM at all times so screen readers
          announce changes rather than a node appearing from nowhere. */}
      <div role="status" aria-live="assertive" className="mt-4 empty:mt-0">
        {status === 'error' && formError && (
          <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm leading-relaxed text-red-800">
            {formError}
          </p>
        )}
        {busy && <p className="sr-only">Sending your request.</p>}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-5 w-full rounded-xl bg-gold-bright px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-70"
      >
        {busy ? submittingLabel : submitLabel}
      </button>

      {/* Display only -- nothing here touches validation or submission.
          The line prints a telephone number, so it carries the licence at the
          same size; text-xs is on the paragraph, not on either child. */}
      <p className="mt-3 text-center text-xs text-muted">
        We never sell your information. Reach us any time at{' '}
        <a href={site.contact.phoneHref} className="underline hover:text-body">
          {site.contact.phone}
        </a>
        . <LicenseLine />
      </p>
    </form>
  )
}
