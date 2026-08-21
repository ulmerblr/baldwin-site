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

import { Resend } from 'resend'
import { formatPhone, type SubmissionFields } from './validate'

export type SubmissionKind = 'quote' | 'apply'

export type Submission = SubmissionFields & {
  kind: SubmissionKind
  /**
   * Seam: set once resume upload ships (Vercel Blob, client-side upload,
   * signed URL). Nothing here needs to change to carry it -- it is rendered
   * into the email body below when present.
   */
  resumeUrl?: string
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

const LABELS: Record<SubmissionKind, string> = {
  quote: 'Quote request',
  apply: 'Application',
}

/**
 * Resend requires a verified sender. Until the domain is verified, Resend's
 * shared onboarding sender works and is the safe default.
 */
const FROM = process.env.NOTIFY_FROM || 'Baldwin Site <onboarding@resend.dev>'

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

  const text = [heading, '', ...rows.map(([k, v]) => `${k}: ${v}`), '', 'Reply to this email to reach the sender directly.'].join('\n')

  const html = [
    `<h2 style="font:600 18px system-ui,sans-serif;margin:0 0 16px">${escapeHtml(heading)}</h2>`,
    '<table style="font:14px/1.6 system-ui,sans-serif;border-collapse:collapse">',
    ...rows.map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
    ),
    '</table>',
    '<p style="font:13px system-ui,sans-serif;color:#666;margin-top:20px">Reply to this email to reach the sender directly.</p>',
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
      subject: SUBJECTS[submission.kind](submission.name),
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

  // Supplementary. A broken ATS must never turn a delivered email into an
  // error the user sees, so its failures are logged and swallowed.
  try {
    await forwardToAts(submission)
  } catch (cause) {
    console.error('notify: ATS forwarding failed', cause)
  }
}
