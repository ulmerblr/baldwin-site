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

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded text-sm font-medium text-ink-300 transition-colors hover:text-gold-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={site.contact.phoneHref}
            className="hidden rounded-lg text-sm font-semibold text-ink-300 transition-colors hover:text-gold-300 sm:block lg:hidden xl:block"
          >
            {site.contact.phone}
          </a>
          <CtaButton kind="quote" className="px-4 py-2 text-sm sm:px-5">
            Start Quote
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
      <path
        d="M13.6 17l2.4 2.4 4.6-4.8"
        fill="none"
        stroke="#e8ca6b"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

        <ul className="mt-10 flex flex-col gap-3 text-sm text-ink-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-2">
          {site.hero.trustStrip.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckMark />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CheckMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="#d9b53d"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  )
}

/* ---------------------------------------------------------------- services */

export function Services() {
  return (
    <section id="services" className="border-b border-navy-800 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={site.services.heading} intro={site.services.intro} />

        {/* Per the build brief the old "Learn More →" links are removed rather
            than shipped pointing at "#". Card text only. */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.items.map((service) => (
            <li
              key={service.title}
              className="rounded-2xl border border-navy-700 bg-navy-900/60 p-6 transition-colors hover:border-gold-500/50"
            >
              <h3 className="text-lg font-semibold text-gold-300">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{service.description}</p>
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
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              {site.about.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
              {site.about.heading}
            </h2>
            <p className="mt-6 leading-relaxed text-ink-300">{site.about.body}</p>

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
                className="mt-8 w-full rounded-2xl border border-navy-700 object-cover"
              />
            */}

            <div className="mt-8">
              <CtaButton kind="quote">{site.hero.primaryCta}</CtaButton>
            </div>
          </div>

          <ul className="space-y-4">
            {site.about.valueProps.map((prop) => (
              <li key={prop.title} className="rounded-2xl border border-navy-700 bg-navy-950/60 p-6">
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
              <span aria-hidden="true" className="text-3xl font-bold tabular-nums text-gold-500/70">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-3">
          <CtaButton kind="quote">{site.howItWorks.cta}</CtaButton>
          <p className="text-sm text-ink-400">{site.howItWorks.footnote}</p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------- agent opportunity */

export function AgentOpportunity() {
  return (
    <section
      id="agent-opportunity"
      className="border-b border-navy-800 bg-navy-900/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            {site.agentOpportunity.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
            {site.agentOpportunity.heading}
          </h2>
          <p className="mt-4 leading-relaxed text-ink-300">{site.agentOpportunity.intro}</p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {site.agentOpportunity.benefits.map((benefit) => (
            <li key={benefit.title} className="rounded-2xl border border-navy-700 bg-navy-950/60 p-6">
              <h3 className="text-base font-semibold text-gold-300">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{benefit.description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-3">
          {/* The live site reads "Upload Your Resume →" and silently discarded
              every file. There is no upload in this build, so the control does
              not claim one. */}
          <CtaButton kind="apply">{site.agentOpportunity.cta}</CtaButton>
          <p className="text-sm text-ink-400">{site.agentOpportunity.footnote}</p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ footer */

export function SiteFooter() {
  return (
    <footer id="contact" className="py-14 sm:py-16">
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
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-ink-400">{site.contact.phoneLabel}</span>
                <a
                  href={site.contact.phoneHref}
                  className="rounded text-ink-300 transition-colors hover:text-gold-300"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <span className="block text-ink-400">{site.contact.emailLabel}</span>
                <a
                  href={site.contact.emailHref}
                  className="rounded break-words text-ink-300 transition-colors hover:text-gold-300"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <span className="block text-ink-400">{site.contact.hoursLabel}</span>
                <span className="text-ink-300">{site.contact.hours}</span>
              </li>
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
          <p className="text-xs text-ink-400">
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
