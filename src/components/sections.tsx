import Link from 'next/link'
import { homeAdditions } from '@/content/pages'
import { productByApprovedTitle, productPage } from '@/content/products'
import { site } from '@/content/site'
import { ImageSlot, OverlayImage } from './image-slot'
import { CtaButton } from './lead-modals'
import { Copy } from './tk'

/* -------------------------------------------------------------------- hero */

export function Hero() {
  return (
    <OverlayImage name="home-hero" priority className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <p className="inline-flex items-center rounded-full border border-gold-bright/50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-bright">
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
export function ProductCard({ title, description }: { title: string; description: string }) {
  const product = productByApprovedTitle.get(title)

  return (
    <li className="flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-gold/50">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
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

/* ------------------------------------------------------------------- about */

export function About() {
  return (
    <section id="about" className="border-b border-line bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
              {site.about.eyebrow}
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl lg:text-[2.75rem]">
              {site.about.heading}
            </h2>
            <p className="mt-6 leading-relaxed text-body">{site.about.body}</p>

            {/*
              The live site shows `site.about.image` here. That file is not in
              this repo yet (see public/images/README.md), so nothing is
              rendered rather than shipping a broken <img>. Once the file is
              added, restore:

              <Image
                src={site.about.image.src}
                alt={site.about.image.alt}
                width={1200}
                height={800}
                className="mt-8 w-full rounded-2xl border border-line object-cover"
              />
            */}

            <div className="mt-8">
              <CtaButton kind="quote">{site.hero.primaryCta}</CtaButton>
            </div>
          </div>

          <ul className="space-y-4">
            {site.about.valueProps.map((prop) => (
              <li key={prop.title} className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-base font-semibold text-ink">{prop.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{prop.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- how it works */

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={site.howItWorks.heading} intro={site.howItWorks.intro} />

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {site.howItWorks.steps.map((step) => (
            <li key={step.number} className="rounded-2xl border border-line bg-surface p-6">
              <span aria-hidden="true" className="text-3xl font-bold tabular-nums text-gold">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-3">
          <CtaButton kind="quote">{site.howItWorks.cta}</CtaButton>
          <p className="text-sm text-muted">{site.howItWorks.footnote}</p>
        </div>
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
    <section id="testimonials" className="border-b border-line py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl lg:text-[2.75rem]">
            {homeAdditions.testimonials.heading}
          </h2>
          <p className="mt-4 leading-relaxed text-body">
            <Copy text={homeAdditions.testimonials.pending} />
          </p>
        </div>

        <ul aria-hidden="true" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <li
              key={index}
              className="rounded-2xl border border-dashed border-line bg-surface p-6"
            >
              <QuoteGlyph />
              <div className="mt-5 space-y-2.5">
                <div className="h-2.5 w-full rounded-full bg-line" />
                <div className="h-2.5 w-11/12 rounded-full bg-line" />
                <div className="h-2.5 w-4/5 rounded-full bg-line" />
              </div>
              <div className="mt-6 h-2.5 w-24 rounded-full bg-gold-bright/40" />
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

/* ------------------------------------------------------------ service areas */

export function ServiceAreas() {
  return (
    <section id="service-areas" className="border-b border-line bg-surface py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl lg:text-[2.75rem]">
            {homeAdditions.serviceAreas.heading}
          </h2>
          <p className="measure mt-5 leading-relaxed text-body">
            {homeAdditions.serviceAreas.body}
          </p>
        </div>
        <ImageSlot name="family" />
      </div>
    </section>
  )
}

/* -------------------------------------------------------- agent opportunity */

export function AgentOpportunity() {
  return (
    <section
      id="agent-opportunity"
      className="border-b border-line bg-surface py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
            {site.agentOpportunity.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl lg:text-[2.75rem]">
            {site.agentOpportunity.heading}
          </h2>
          <p className="mt-4 leading-relaxed text-body">{site.agentOpportunity.intro}</p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {site.agentOpportunity.benefits.map((benefit) => (
            <li key={benefit.title} className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="text-base font-semibold text-ink">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{benefit.description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-3">
          {/* The live site reads "Upload Your Resume →" and silently discarded
              every file. There is no upload in this build, so the control does
              not claim one. */}
          <CtaButton kind="apply">{site.agentOpportunity.cta}</CtaButton>
          <p className="text-sm text-muted">{site.agentOpportunity.footnote}</p>
        </div>
      </div>
    </section>
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
