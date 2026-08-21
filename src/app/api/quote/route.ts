import { handleSubmission } from '@/lib/handle-submission'

// Node runtime: the Resend SDK and the in-memory rate limiter both want it.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return handleSubmission(request, 'quote')
}
