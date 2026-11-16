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
import { formatPhone, type PhoneFlag } from './phone'
import { type BotSignal, type SubmissionFields } from './validate'

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
  /**
   * Why the telephone number is worth a second look, if it is. Separate from
   * `signals` on purpose: an odd-looking number says nothing about whether
   * the email address is real, so it must never suppress the confirmation
   * the way a bot signal does.
   */
  phoneFlags?: PhoneFlag[]
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

function flagsOf(submission: Submission): BotSignal[] {
  return submission.signals ?? []
}

function phoneFlagsOf(submission: Submission): PhoneFlag[] {
  return submission.phoneFlags ?? []
}

/**
 * One bracket on the subject line, never two.
 *
 * A submission can be suspicious in more than one way at once, and stacking
 * `[possible bot] [check number] New quote request` reads as noise and buries
 * the part that identifies the enquiry. So there is a single prefix that lists
 * what was flagged: `[possible bot]`, `[check number]`, or
 * `[possible bot, check number]`. The bot wording is unchanged from before, so
 * any filter already sorting on it keeps working.
 */
function subjectPrefix(submission: Submission): string {
  const parts: string[] = []
  if (flagsOf(submission).length > 0) parts.push('possible bot')
  if (phoneFlagsOf(submission).length > 0) parts.push('check number')
  return parts.length > 0 ? `[${parts.join(', ')}] ` : ''
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
    ['Phone', formatPhone(submission.phone, submission.phoneExt)],
    ['Email', submission.email],
  ]
  if (submission.resumeUrl) rows.push(['Resume', submission.resumeUrl])

  const heading = `${LABELS[submission.kind]} from baldwinlifeinsurance.com`
  const flags = flagsOf(submission)
  const phoneFlags = phoneFlagsOf(submission)
  const notes: string[] = []
  if (flags.length > 0) {
    notes.push(
      `Heads up: this one looks automated (${flags.join(', ')}). It is passed on rather than blocked in case it is a real person. Judge it on the details above.`,
    )
  }
  if (phoneFlags.length > 0) {
    notes.push(
      `The number given looks unusual (${phoneFlags.join(', ')}). It is passed on exactly as entered -- worth a glance before you dial.`,
    )
  }

  const text = [
    heading,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Reply to this email to reach the sender directly.',
    ...notes.flatMap((n) => ['', n]),
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
    ...notes.map(
      (n) =>
        `<p style="font:13px/1.6 system-ui,sans-serif;color:#8a6d3b;background:#fdf6e3;border:1px solid #e8d9a8;border-radius:8px;padding:12px;margin-top:16px">${escapeHtml(n)}</p>`,
    ),
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
      subject: subjectPrefix(submission) + SUBJECTS[submission.kind](submission.name),
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

  // A probable-bot submission may carry an address its owner never typed. The
  // agency notification still goes out, so no lead is lost; this courtesy does
  // not, so the site never mails a stranger on a bot's say-so.
  //
  // Deliberately keyed on bot signals alone. An odd-looking telephone number
  // says nothing about whether the email address belongs to the person who
  // typed it, and a real customer with an unusual number should still get
  // their confirmation like anybody else.
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
