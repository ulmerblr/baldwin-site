import type { OverlaySlotName } from '@/content/images'
import { site } from '@/content/site'
import { OverlayImage } from './image-slot'
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
  imageSlot,
}: {
  eyebrow?: string
  heading: string
  intro?: string
  /**
   * A Type B overlay slot. Pages that have one pass it and the header becomes
   * a photographic band; pages that do not (the product detail pages, which
   * carry their own standalone photo further down) get the quiet paper header.
   */
  imageSlot?: OverlaySlotName
}) {
  const inner = (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      {eyebrow && (
        <p
          className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${
            imageSlot
              // Opaque fill on the overlay variant: see the note in Hero --
              // gold-bright as small text on a scrim fails AA over a bright
              // photograph, and its own ground fixes that without a scrim
              // heavy enough to bury the image.
              ? 'border border-gold-bright/50 bg-ink text-gold-bright'
              : 'border border-gold/50 bg-gold-wash text-gold-deep'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className={`font-display max-w-3xl text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[3.4rem] ${
          imageSlot ? 'text-overlay-text' : 'text-ink'
        } ${eyebrow ? 'mt-6' : ''}`}
      >
        {heading}
      </h1>
      {intro && (
        <p
          className={`measure mt-6 text-base leading-relaxed sm:text-lg ${
            imageSlot ? 'text-overlay-text/90' : 'text-body'
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  )

  if (imageSlot) {
    return (
      <OverlayImage name={imageSlot} priority className="border-b border-line">
        {inner}
      </OverlayImage>
    )
  }

  return <section className="border-b border-line bg-gold-wash">{inner}</section>
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
      <h2 className="font-display text-2xl font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-3xl">
        {heading}
      </h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed text-body">
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
        <li key={item} className="flex items-start gap-3 leading-relaxed text-body">
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
      stroke="#A67C1A"
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
    <section className="border-b border-line bg-gold-wash py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 text-center sm:px-6">
        {lead && (
          <p className="font-display text-xl font-semibold tracking-[-0.01em] text-ink sm:text-2xl">
            {lead}
          </p>
        )}
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
        <p className="rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed text-muted">
          {text}
        </p>
      </div>
    </section>
  )
}
