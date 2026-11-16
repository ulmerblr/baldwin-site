/**
 * Shared request handling for /api/quote and /api/apply.
 *
 * The two endpoints differ only in the notification they produce, so the
 * pipeline -- parse, rate limit, validate, notify -- lives here once.
 *
 * Every response is JSON in one of exactly two shapes:
 *   { ok: true }
 *   { ok: false, error: "<something a person can read>" }
 * Internal detail is logged server-side and never returned.
 *
 * BOTS. A submission that trips the trap is accepted, flagged and delivered,
 * not refused. The trap used to return 400, which meant a false positive --
 * and there were false positives, from ordinary Chrome autofill -- threw the
 * lead away and told the person only that their submission could not be
 * processed. For a small agency a lost prospect is worth far more than the
 * junk email that gets through instead, so the error this code now prefers to
 * make is the cheap one. Chris sees the flag in the subject line and decides.
 *
 * LOGGING. Every outcome writes exactly one line, success included. This is
 * not decoration. For a while the only paths that logged were the ones where
 * Resend failed, so a form that was turning submissions away -- on the rate
 * limit, on unreadable JSON, on the honeypot -- produced no trace at all, and
 * a quiet log could mean the form was healthy or that it was refusing
 * everyone. Those two states must never look the same again. No line carries
 * the submitter's name, telephone number or email: the log says what
 * happened, not who it happened to.
 */

import { NextResponse } from 'next/server'
import { notify, NotifyError, type SubmissionKind } from './notify'
import { clientIp, rateLimit } from './rate-limit'
import { validateSubmission } from './validate'

type ApiResponse = { ok: true } | { ok: false; error: string }

function json(body: ApiResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers })
}

export async function handleSubmission(
  request: Request,
  kind: SubmissionKind,
): Promise<NextResponse> {
  // Rate limit before doing any work on the body.
  const limit = rateLimit(clientIp(request.headers))
  if (!limit.allowed) {
    console.warn(`submission(${kind}): refused by rate limit, retry after ${limit.retryAfter}s`)
    return json(
      {
        ok: false,
        error: 'Too many requests from this connection. Please wait a few minutes and try again, or call us at (858) 729-0003.',
      },
      429,
      { 'Retry-After': String(limit.retryAfter) },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    console.warn(`submission(${kind}): refused, request body was not valid JSON`)
    return json({ ok: false, error: 'We could not read that submission. Please try again.' }, 400)
  }

  const parsed = validateSubmission(body)
  if (!parsed.ok) {
    // `honeypot` here means a real browser filled a field no human can see --
    // usually a password manager or autofill reaching a field it should have
    // left alone. It reads as a bot and the person is turned away with no
    // idea why, so it is worth seeing in the log.
    console.warn(`submission(${kind}): refused by validation, reason=${parsed.reason}`)
    return json({ ok: false, error: parsed.error }, 400)
  }

  const { signals } = parsed
  const flagged = signals.length > 0

  try {
    await notify({ kind, ...parsed.data, signals })
  } catch (cause) {
    if (cause instanceof NotifyError) {
      return json(
        {
          ok: false,
          error: `${cause.message} Please try again in a moment, or reach us directly at (858) 729-0003.`,
        },
        502,
      )
    }
    console.error(`handleSubmission(${kind}): unexpected failure`, cause)
    return json(
      {
        ok: false,
        error: 'Something went wrong on our end and your request was not sent. Please try again, or call us at (858) 729-0003.',
      },
      500,
    )
  }

  console.info(
    flagged
      ? `submission(${kind}): accepted and notified, flagged as probable bot (${signals.join(', ')})`
      : `submission(${kind}): accepted and notified`,
  )
  return json({ ok: true }, 200)
}
