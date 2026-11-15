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
      <PageHeader eyebrow={about.eyebrow} heading={about.heading} imageSlot="about-header" />

      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* The working half of the bio, with the studio portrait. The
              opening section that used to sit above this one is gone: it had
              been cut down to a heading over a single sentence, and that
              sentence is now the first line here. */}
          <div className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:items-center lg:gap-14">
            <ImageSlot name="chris-portrait" />

            <div className="measure">
              <TextBlock heading={about.bio.heading} paragraphs={about.bio.professional} />
            </div>
          </div>
        </div>
      </section>

      {/*
        The home half of the same bio, continuing the band above it and
        sitting ahead of the approved "Family & Integrity Come First" copy
        further down. No heading of its own: it is a continuation, and a
        title for it would be words nobody asked for.

        The family photograph is a casual snapshot and the portrait above it
        is a studio headshot, which is a real shift in register. Left to sit
        plainly next to each other they would look like a mismatch rather
        than a choice, so this one is framed: its own band, its own ground, a
        ruled and padded frame around the photograph, and a caption-sized
        line of clear space under it. The separation is what makes the
        informality read as deliberate.
      */}
      <section className="border-b border-line bg-gold-wash py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-16">
            <div className="measure">
              <TextBlock paragraphs={about.bio.personal} />
            </div>

            <figure className="rounded-3xl border border-line bg-paper p-3 sm:p-4">
              <ImageSlot name="baldwin-family" />
            </figure>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface py-16 sm:py-20">
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
                    className="rounded-2xl border border-line bg-surface p-5"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-body">
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

      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
            {/* The client's approved About copy, reused verbatim from the home
                page rather than restated. */}
            <TextBlock heading={site.about.heading} paragraphs={[site.about.body]} />

            <ul className="space-y-4">
              {site.about.valueProps.map((prop) => (
                <li
                  key={prop.title}
                  className="rounded-2xl border border-line bg-surface p-6"
                >
                  <h3 className="text-base font-semibold text-ink">{prop.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{prop.description}</p>
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
