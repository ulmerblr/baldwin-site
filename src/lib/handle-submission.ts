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
    return json({ ok: false, error: 'We could not read that submission. Please try again.' }, 400)
  }

  const parsed = validateSubmission(body)
  if (!parsed.ok) {
    return json({ ok: false, error: parsed.error }, 400)
  }

  try {
    await notify({ kind, ...parsed.data })
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

  return json({ ok: true }, 200)
}
