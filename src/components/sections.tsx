import Link from 'next/link'
import { homeAdditions } from '@/content/pages'
import { productByApprovedTitle, productPage } from '@/content/products'
import { site } from '@/content/site'
import { ImageSlot, OverlayImage } from './image-slot'
import { CtaButton } from './lead-modals'

/* -------------------------------------------------------------------- hero */

export function Hero() {
  return (
    <OverlayImage name="home-hero" priority className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
{/* Opaque ink fill, not just a border: gold-bright is a FILL colour, and
            as small text directly on a scrim it fails AA the moment a bright
            photograph lands behind it (2.56:1 over a white frame). Holding it
            to AA via the scrim alone would need a 0.88 floor, which would bury
            the photograph. Giving the pill its own ground makes the contrast
            photo-independent at 6.91:1 and leaves the scrim free to stay light
            enough for the image to read. */}
        <p className="inline-flex items-center rounded-full border border-gold-bright/50 bg-ink px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-bright">
          {site.hero.eyebrow}
        </p>

        <h1 className="font-display mt-7 max-w-3xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.02em] text-overlay-text sm:text-6xl lg:text-7xl">
          {site.hero.headline}
        </h1>

        <p className="measure mt-7 text-base leading-relaxed text-overlay-text/90 sm:text-lg">
          {site.hero.subhead}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <CtaButton kind="quote">{site.hero.primaryCta}</CtaButton>
          <CtaButton kind="apply" variant="onDark">
            {site.hero.secondaryCta}
          </CtaButton>
        </div>

        <ul className="mt-12 flex flex-col gap-3 text-sm text-overlay-text/85 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2">
          {site.hero.trustStrip.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <CheckMark />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </OverlayImage>
  )
}

export function CheckMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-gold-bright"
    >
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  )
}

/* ---------------------------------------------------------------- services */

/**
 * One product card. Shared by the home page and the products overview so the
 * approved blurb and the link to the detail page stay in one place.
 */
export function ProductCard({
  title,
  description,
  headingLevel = 'h3',
}: {
  title: string
  description: string
  /**
   * The card sits under a section heading on the home page, so h3 is right
   * there. On /products the grid is the page's contents list, directly below
   * the h1 with no h2 between, and an h3 there skips a level.
   */
  headingLevel?: 'h2' | 'h3'
}) {
  const product = productByApprovedTitle.get(title)
  const Heading = headingLevel

  return (
    <li className="flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-gold/50">
      <Heading className="text-lg font-semibold text-ink">{title}</Heading>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{description}</p>
      {product && (
        <Link
          href={product.href}
          className="mt-5 inline-flex w-fit rounded text-sm font-semibold text-gold-deep underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {productPage.learnMore}
          <span className="sr-only"> about {title}</span>
        </Link>
      )}
    </li>
  )
}

export function Services() {
  return (
    <section id="services" className="border-b border-line py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={site.services.heading} intro={site.services.intro} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.items.map((service) => (
            <ProductCard
              key={service.title}
              title={service.title}
              description={service.description}
            />
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <CtaButton kind="quote">{site.hero.primaryCta}</CtaButton>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- chris card */

/**
 * The promotional card, on its own between the hero and the products.
 *
 * The artwork is square and already carries its own headline, portrait and
 * business card, so it is treated as finished material rather than raw
 * imagery: nothing is laid over it, it is never cropped, and no heading of
 * ours competes with the one printed inside it. It gets a quiet band and
 * room to breathe.
 *
 * Width is the legibility decision, and it is the whole reason the cap is as
 * generous as it is. The card's smallest printed lines -- the street address,
 * the licence and fax numbers -- are about 17px inside a 1254px square, so
 * they only clear 12px on screen once the card is rendered near 900px wide.
 * Hence max-w-4xl rather than something more restrained.
 *
 * On a phone none of that is reachable: 1254px of artwork inside a 328px
 * column puts the fine print at about 4px, and no layout choice fixes that.
 * What carries there is the headline, the name, and the portrait. The
 * information itself is not trapped in the picture -- the phone number is in
 * the header on every page, the phone, email and hours are in the footer, and
 * the alt text names him and says the card carries contact details.
 */
export function ChrisCard() {
  return (
    <section className="border-b border-line py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <ImageSlot name="chris-card" />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- testimonials */

/**
 * The band is built and styled; the quotes are not written.
 *
 * Client testimonials on an insurance site are regulated advertising. Sample
 * quotes -- even obviously fake ones -- are a compliance problem, so the cards
 * below carry no text at all: they show the shape the real ones will take and
 * are hidden from assistive tech until they say something.
 */
export function Testimonials() {
  return (
    <section id="testimonials" className="border-b border-line bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl lg:text-[2.75rem]">
          {homeAdditions.testimonials.heading}
        </h2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {homeAdditions.testimonials.items.map((item) => (
            <li
              key={item.name}
              className="flex flex-col rounded-2xl border border-line bg-paper p-6"
            >
              <QuoteGlyph />
              {/* blockquote + figcaption: the attribution is marked up as the
                  source of the quote, not as another line of body text. */}
              <figure className="mt-5 flex flex-1 flex-col">
                <blockquote className="flex-1 leading-relaxed text-body">{item.quote}</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <span className="block text-sm font-semibold text-ink">
                    {item.name}
                    <span className="font-normal text-body">, {item.state}</span>
                  </span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-[0.14em] text-gold-deep">
                    {item.line}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function QuoteGlyph() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      stroke="#A67C1A"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="opacity-60"
    >
      <path d="M11 8H6a2 2 0 00-2 2v4a2 2 0 002 2h3v1a3 3 0 01-3 3M24 8h-5a2 2 0 00-2 2v4a2 2 0 002 2h3v1a3 3 0 01-3 3" />
    </svg>
  )
}

/* ------------------------------------------------------------------ shared */

export function SectionHeading({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      <p className="mt-4 leading-relaxed text-body">{intro}</p>
    </div>
  )
}
