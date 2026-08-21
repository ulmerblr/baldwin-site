import Link from 'next/link'
import { site } from '@/content/site'
import { CtaButton } from './lead-modals'
import { CurrentYear } from './current-year'

/* ------------------------------------------------------------------ header */

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-800/80 bg-navy-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg">
          <BrandMark />
          <span className="text-sm font-bold leading-tight text-ink-100 sm:text-base">
            Baldwin
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-gold-400 sm:text-[11px]">
              Insurance Agency
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={site.contact.phoneHref}
            className="hidden rounded-lg text-sm font-semibold text-ink-300 transition-colors hover:text-gold-300 sm:block"
          >
            {site.contact.phone}
          </a>
          <CtaButton kind="quote" className="px-4 py-2 text-sm sm:px-5">
            {site.hero.primaryCta}
          </CtaButton>
        </div>
      </div>
    </header>
  )
}

function BrandMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" className="shrink-0">
      <rect width="34" height="34" rx="8" fill="#0f2038" stroke="#c9a227" strokeWidth="1.5" />
      <path
        d="M17 8l7 3.2v5.4c0 4.2-2.9 7.6-7 8.9-4.1-1.3-7-4.7-7-8.9v-5.4L17 8z"
        fill="none"
        stroke="#c9a227"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.6 17l2.4 2.4 4.6-4.8" fill="none" stroke="#e8ca6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* -------------------------------------------------------------------- hero */

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-navy-800">
      {/* Decorative ground: a gold wash over navy, no raster asset to load. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.16),transparent_58%),radial-gradient(ellipse_at_bottom_left,rgba(30,63,102,0.5),transparent_62%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <p className="inline-flex items-center rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
          {site.hero.eyebrow}
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-ink-100 sm:text-5xl lg:text-6xl">
          {site.hero.headline}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
          {site.hero.subhead}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <CtaButton kind="quote">{site.hero.primaryCta}</CtaButton>
          <CtaButton kind="apply" variant="secondary">
            {site.hero.secondaryCta}
          </CtaButton>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- products */

export function Products() {
  return (
    <section id="products" className="border-b border-navy-800 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={site.products.heading} intro={site.products.intro} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.products.items.map((product) => (
            <li
              key={product.title}
              className="rounded-2xl border border-navy-700 bg-navy-900/60 p-6 transition-colors hover:border-gold-500/50"
            >
              <h3 className="text-lg font-semibold text-gold-300">{product.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{product.description}</p>
            </li>
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
    <section id="about" className="border-b border-navy-800 bg-navy-900/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
              {site.about.heading}
            </h2>
            <div className="mt-6 space-y-4">
              {site.about.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="leading-relaxed text-ink-300">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <CtaButton kind="quote">{site.hero.primaryCta}</CtaButton>
            </div>
          </div>

          <ul className="space-y-4">
            {site.about.valueProps.map((prop) => (
              <li
                key={prop.title}
                className="rounded-2xl border border-navy-700 bg-navy-950/60 p-6"
              >
                <h3 className="text-base font-semibold text-gold-300">{prop.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{prop.description}</p>
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
    <section id="how-it-works" className="border-b border-navy-800 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={site.howItWorks.heading} intro={site.howItWorks.intro} />

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {site.howItWorks.steps.map((step) => (
            <li key={step.number} className="rounded-2xl border border-navy-700 bg-navy-900/60 p-6">
              <span
                aria-hidden="true"
                className="text-3xl font-bold tabular-nums text-gold-500/70"
              >
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- recruiting */

export function Recruiting() {
  return (
    <section id="careers" className="border-b border-navy-800 bg-navy-900/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={site.recruiting.heading} intro={site.recruiting.intro} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {site.recruiting.benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="rounded-2xl border border-navy-700 bg-navy-950/60 p-6"
            >
              <h3 className="text-base font-semibold text-gold-300">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{benefit.description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          {/* Was "Upload Your Resume" on the old site, which promised an upload
              that silently discarded every file. There is no upload in this
              build, so the control does not claim one. */}
          <CtaButton kind="apply">{site.recruiting.cta} &rarr;</CtaButton>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ footer */

export function SiteFooter() {
  return (
    <footer className="py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-bold text-ink-100">{site.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              {site.footer.blurb}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              {site.footer.contactLabel}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={site.contact.phoneHref}
                  className="rounded text-ink-300 transition-colors hover:text-gold-300"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.emailHref}
                  className="rounded break-words text-ink-300 transition-colors hover:text-gold-300"
                >
                  {site.contact.email}
                </a>
              </li>
              <li className="text-ink-400">{site.contact.hours}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              {site.footer.legalLabel}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="rounded text-ink-300 transition-colors hover:text-gold-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="rounded text-ink-300 transition-colors hover:text-gold-300"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-800 pt-8">
          <p className="text-xs leading-relaxed text-ink-400">{site.footer.disclaimer}</p>
          <p className="mt-4 text-xs text-ink-400">
            &copy; <CurrentYear buildYear={new Date().getFullYear()} /> {site.legalName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ shared */

function SectionHeading({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">{title}</h2>
      <p className="mt-4 leading-relaxed text-ink-300">{intro}</p>
    </div>
  )
}
