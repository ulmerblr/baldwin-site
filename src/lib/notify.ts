/**
 * Notification seam.
 *
 * Both route handlers call `notify()` and nothing else. Today it sends one
 * email via Resend. Later it will also forward applications to the ATS. The
 * handlers do not need to know which of those happened.
 *
 * Failure contract: if the agency will not learn about a submission, `notify()`
 * throws. The handler turns that into an error the user can see. A submission
 * that silently vanishes is the failure mode this rebuild exists to eliminate,
 * so there is no optimistic success path here.
 */

import { site } from '@/content/site'
import { Resend } from 'resend'
import { formatPhone, type BotSignal, type SubmissionFields } from './validate'

export type SubmissionKind = 'quote' | 'apply'

export type Submission = SubmissionFields & {
  kind: SubmissionKind
  /**
   * Seam: set once resume upload ships (Vercel Blob, client-side upload,
   * signed URL). Nothing here needs to change to carry it -- it is rendered
   * into the email body below when present.
   */
  resumeUrl?: string
  /**
   * Why this submission looks automated, if it does. Empty for an ordinary
   * one. A flagged submission is still delivered -- the agency would rather
   * delete a junk email than never hear from a prospect -- but it is marked
   * so Chris can tell at a glance, and the courtesy confirmation is withheld
   * so a forged address never receives mail it did not ask for.
   */
  signals?: BotSignal[]
}

/** Thrown when the agency could not be notified. Message is user-safe. */
export class NotifyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotifyError'
  }
}

const SUBJECTS: Record<SubmissionKind, (name: string) => string> = {
  quote: (name) => `New quote request — ${name}`,
  apply: (name) => `New application — ${name}`,
}

/** Prefixed to the subject of a flagged notification. Never shown to a visitor. */
const FLAG_PREFIX = '[possible bot] '

function flagsOf(submission: Submission): BotSignal[] {
  return submission.signals ?? []
}

const LABELS: Record<SubmissionKind, string> = {
  quote: 'Quote request',
  apply: 'Application',
}

/**
 * Resend requires a verified sender. Until the domain is verified, Resend's
 * shared onboarding sender works and is the safe default.
 */
const FROM = process.env.NOTIFY_FROM || `${site.name} <onboarding@resend.dev>`

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildBody(submission: Submission): { text: string; html: string } {
  const rows: Array<[string, string]> = [
    ['Name', submission.name],
    ['Phone', formatPhone(submission.phone)],
    ['Email', submission.email],
  ]
  if (submission.resumeUrl) rows.push(['Resume', submission.resumeUrl])

  const heading = `${LABELS[submission.kind]} from baldwinlifeinsurance.com`
  const flags = flagsOf(submission)
  const note =
    flags.length > 0
      ? `Heads up: this one looks automated (${flags.join(', ')}). It is passed on rather than blocked in case it is a real person. Judge it on the details above.`
      : ''

  const text = [
    heading,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Reply to this email to reach the sender directly.',
    ...(note ? ['', note] : []),
  ].join('\n')

  const html = [
    `<h2 style="font:600 18px system-ui,sans-serif;margin:0 0 16px">${escapeHtml(heading)}</h2>`,
    '<table style="font:14px/1.6 system-ui,sans-serif;border-collapse:collapse">',
    ...rows.map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
    ),
    '</table>',
    '<p style="font:13px system-ui,sans-serif;color:#666;margin-top:20px">Reply to this email to reach the sender directly.</p>',
    ...(note
      ? [
          `<p style="font:13px/1.6 system-ui,sans-serif;color:#8a6d3b;background:#fdf6e3;border:1px solid #e8d9a8;border-radius:8px;padding:12px;margin-top:16px">${escapeHtml(note)}</p>`,
        ]
      : []),
  ].join('')

  return { text, html }
}

async function sendEmail(submission: Submission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL

  if (!apiKey || !to) {
    // Misconfiguration, not user error. Log for the operator, tell the user
    // something true: it did not go through.
    console.error('notify: missing RESEND_API_KEY or NOTIFY_EMAIL')
    throw new NotifyError('We could not send your request right now.')
  }

  const { text, html } = buildBody(submission)

  let result
  try {
    result = await new Resend(apiKey).emails.send({
      from: FROM,
      to: [to],
      subject:
        (flagsOf(submission).length > 0 ? FLAG_PREFIX : '') +
        SUBJECTS[submission.kind](submission.name),
      text,
      html,
      // Replying to the notification reaches the submitter directly.
      replyTo: submission.email,
    })
  } catch (cause) {
    console.error('notify: resend threw', cause)
    throw new NotifyError('We could not send your request right now.')
  }

  if (result.error) {
    console.error('notify: resend returned an error', result.error)
    throw new NotifyError('We could not send your request right now.')
  }
}

/**
 * Confirmation to the person who filled in the form.
 *
 * COPY. The two messages are the client's, reproduced exactly. The agency
 * name and the telephone number inside them are interpolated from
 * `site.contact` rather than retyped, so the rendered text is identical to
 * what was supplied and cannot drift from the rest of the site if either
 * value changes. The footer's four values are pulled the same way; none of
 * them is typed in here.
 *
 * SENDER. `FROM`, the same NOTIFY_FROM-driven value the agency notification
 * uses. Nothing here hardcodes an address, so the Resend sending domain can
 * be switched entirely from the environment.
 *
 * REPLY-TO. Chris, so a reply from the submitter reaches a person. Note this
 * is the opposite of the agency notification, where reply-to is the
 * submitter.
 *
 * FAILURE. This is a courtesy. It must never turn a delivered agency
 * notification into an error the submitter sees -- see `notify()`.
 */
const CONFIRMATIONS: Record<SubmissionKind, { subject: string; body: string }> = {
  quote: {
    subject: `We got your request — ${site.name}`,
    body: `Thanks for reaching out. A licensed Baldwin agent will contact you directly within one business day. If you need us sooner, call ${site.contact.phone}.`,
  },
  apply: {
    subject: `We got your application — ${site.name}`,
    body: `Thanks for your interest in joining ${site.name}. We review every application and will be in touch.`,
  },
}

/** Agency name, address, phone and licence -- every one from the content file. */
const CONFIRMATION_FOOTER = [
  site.name,
  site.contact.address,
  site.contact.phone,
  site.contact.licenseInline,
]

async function sendConfirmation(submission: Submission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // Nothing to send with; the caller already logged it.

  // A flagged submission may carry an address its owner never typed. The
  // agency notification still goes out, so no lead is lost; this courtesy
  // does not, so the site never mails a stranger on a bot's say-so.
  if (flagsOf(submission).length > 0) return

  const { subject, body } = CONFIRMATIONS[submission.kind]

  const text = [body, '', ...CONFIRMATION_FOOTER].join('\n')
  const html = [
    `<p style="font:15px/1.6 system-ui,sans-serif;margin:0 0 24px">${escapeHtml(body)}</p>`,
    '<hr style="border:none;border-top:1px solid #e5e2da;margin:0 0 16px">',
    `<p style="font:13px/1.6 system-ui,sans-serif;color:#666;margin:0">${CONFIRMATION_FOOTER.map(escapeHtml).join('<br>')}</p>`,
  ].join('')

  const result = await new Resend(apiKey).emails.send({
    from: FROM,
    to: [submission.email],
    subject,
    text,
    html,
    // A reply to the confirmation should reach Chris, not the sender itself.
    replyTo: site.contact.email,
  })

  if (result.error) throw new Error(`resend rejected the confirmation: ${result.error.message}`)
}

/**
 * Forward to the ATS, once one exists.
 *
 * Ships disabled: `ATS_INTAKE_URL` is unset in production today, so this is a
 * silent no-op. The payload shape is deliberately not designed here -- that is
 * the ATS team's call when they build the intake endpoint.
 */
async function forwardToAts(submission: Submission): Promise<void> {
  const intakeUrl = process.env.ATS_INTAKE_URL
  if (!intakeUrl) return // The state we ship in.

  const sharedSecret = process.env.ATS_SHARED_SECRET
  void sharedSecret
  void submission

  // ---------------------------------------------------------------------
  // ATS forwarding POST goes here.
  //
  // Send `submission` (plus `resumeUrl` once upload ships) to `intakeUrl`,
  // authenticated with `ATS_SHARED_SECRET`. Failures must be caught by the
  // caller below, not surfaced to the user: the email has already been sent,
  // so the submission is not lost and the person should still see success.
  // ---------------------------------------------------------------------
}

/**
 * Notify the agency of a submission.
 * Throws `NotifyError` (user-safe message) if the email could not be sent.
 */
export async function notify(submission: Submission): Promise<void> {
  // Email first: this is the delivery guarantee. If it throws, the user is told.
  await sendEmail(submission)

  // Everything below is supplementary. The agency has been notified, so the
  // submission is not lost and the person must still see success -- these
  // failures are logged and swallowed rather than surfaced.
  try {
    await sendConfirmation(submission)
  } catch (cause) {
    console.error('notify: confirmation to submitter failed', cause)
  }

  try {
    await forwardToAts(submission)
  } catch (cause) {
    console.error('notify: ATS forwarding failed', cause)
  }
}
