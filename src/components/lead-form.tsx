'use client'

import { useId, useState } from 'react'
import { site } from '@/content/site'

/** Mirrors HONEYPOT_FIELD in src/lib/validate.ts. */
const HONEYPOT_FIELD = 'company_website'

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
  const [honeypot, setHoneypot] = useState('')
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
          [HONEYPOT_FIELD]: honeypot,
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
          className="rounded-xl border border-gold-500/40 bg-gold-500/10 p-5"
        >
          <p className="font-semibold text-gold-300">{successTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">{successBody}</p>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="mt-5 w-full rounded-xl bg-gold-500 px-6 py-3 font-semibold text-navy-950 transition-colors hover:bg-gold-400"
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
              <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-ink-300">
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
                className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-ink-100 placeholder:text-ink-400 disabled:opacity-60 ${
                  invalid ? 'border-red-400' : 'border-navy-700'
                }`}
              />
              {invalid && (
                <p id={errorId} className="mt-1.5 text-sm text-red-300">
                  {errors[field.name]}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Honeypot: hidden from sighted users and removed from the a11y tree. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${formId}-hp`}>Company website (leave blank)</label>
        <input
          id={`${formId}-hp`}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Status region. Present in the DOM at all times so screen readers
          announce changes rather than a node appearing from nowhere. */}
      <div role="status" aria-live="assertive" className="mt-4 empty:mt-0">
        {status === 'error' && formError && (
          <p className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm leading-relaxed text-red-200">
            {formError}
          </p>
        )}
        {busy && <p className="sr-only">Sending your request.</p>}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-5 w-full rounded-xl bg-gold-500 px-6 py-3.5 font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {busy ? submittingLabel : submitLabel}
      </button>

      <p className="mt-3 text-center text-xs text-ink-400">
        We never sell your information. Reach us any time at{' '}
        <a href={site.contact.phoneHref} className="underline hover:text-ink-300">
          {site.contact.phone}
        </a>
        .
      </p>
    </form>
  )
}
