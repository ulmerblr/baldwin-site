import { site } from '@/content/site'
import { CtaButton } from './lead-modals'
import { LinkButton } from './link-button'
import { Copy } from './tk'

/**
 * Shared furniture for the interior pages. Same type scale, spacing and card
 * treatment as the home page -- a visitor should not be able to tell which
 * pages arrived later.
 */

export function PageHeader({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow?: string
  heading: string
  intro?: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy-800">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.14),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(30,63,102,0.45),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        {eyebrow && (
          <p className="inline-flex items-center rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            {eyebrow}
          </p>
        )}
        <h1
          className={`max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-ink-100 sm:text-5xl ${
            eyebrow ? 'mt-6' : ''
          }`}
        >
          {heading}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}

/** A titled block of body copy. TK placeholders inside render as chips. */
export function TextBlock({
  heading,
  paragraphs,
  className = '',
}: {
  heading: string
  paragraphs: readonly string[]
  className?: string
}) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold tracking-tight text-ink-100 sm:text-3xl">{heading}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed text-ink-300">
          <Copy text={paragraph} />
        </p>
      ))}
    </div>
  )
}

/** Checked list, matching the hero's trust strip treatment. */
export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 leading-relaxed text-ink-300">
          <span className="mt-1.5 shrink-0">
            <Bullet />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Bullet() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="#d9b53d"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  )
}

/**
 * Closing call to action. `secondary` is the phone number on most pages, which
 * is a link rather than a dialog.
 */
export function CtaBand({
  lead,
  primary,
  kind = 'quote',
  callToAction,
}: {
  lead?: string
  primary: string
  kind?: 'quote' | 'apply'
  callToAction?: string
}) {
  return (
    <section className="border-b border-navy-800 py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 text-center sm:px-6">
        {lead && <p className="text-lg font-semibold text-ink-100">{lead}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <CtaButton kind={kind}>{primary}</CtaButton>
          <LinkButton href={site.contact.phoneHref}>
            {callToAction ?? `Call ${site.contact.phone}`}
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

/** The state-variation line that sits above the footer on every product page. */
export function Disclaimer({ text }: { text: string }) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="rounded-2xl border border-navy-800 bg-navy-900/40 p-5 text-sm leading-relaxed text-ink-400">
          {text}
        </p>
      </div>
    </section>
  )
}
