import type { Metadata } from 'next'
import { ImageSlot } from '@/components/image-slot'
import { CtaBand, PageHeader, TextBlock } from '@/components/page-sections'
import { SiteShell } from '@/components/site-shell'
import { Copy } from '@/components/tk'
import { about } from '@/content/pages'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(about.meta)

export default function AboutPage() {
  return (
    <SiteShell path="/about">
      <PageHeader eyebrow={about.eyebrow} heading={about.heading} />

      <section className="border-b border-navy-800 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            <ImageSlot name="chris-portrait" />

            <div>
              <TextBlock heading={about.story.heading} paragraphs={about.story.paragraphs} />
              <TextBlock
                heading={about.approach.heading}
                paragraphs={about.approach.paragraphs}
                className="mt-12"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-navy-800 bg-navy-900/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <TextBlock heading={about.licensing.heading} paragraphs={[about.licensing.body]} />

              {/*
                License numbers and credentials are regulated advertising
                claims. Every value below is unfilled on purpose and renders as
                a visible placeholder -- see src/components/tk.tsx.
              */}
              <dl className="mt-8 space-y-4">
                {about.licensing.items.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-navy-700 bg-navy-950/60 p-5"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink-300">
                      <Copy text={item.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <ImageSlot name="about-secondary" />
          </div>
        </div>
      </section>

      <section className="border-b border-navy-800 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
            {/* The client's approved About copy, reused verbatim from the home
                page rather than restated. */}
            <TextBlock heading={site.about.heading} paragraphs={[site.about.body]} />

            <ul className="space-y-4">
              {site.about.valueProps.map((prop) => (
                <li
                  key={prop.title}
                  className="rounded-2xl border border-navy-700 bg-navy-900/60 p-6"
                >
                  <h3 className="text-base font-semibold text-gold-300">{prop.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">{prop.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand primary={site.hero.primaryCta} callToAction={about.secondaryCta} />
    </SiteShell>
  )
}
