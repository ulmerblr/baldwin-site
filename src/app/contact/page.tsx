import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-sections'
import { SiteShell } from '@/components/site-shell'
import { CtaButton } from '@/components/lead-modals'
import { LicenseLine } from '@/components/license-line'
import { contact } from '@/content/pages'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(contact.meta)

const CARD = 'min-w-0 rounded-2xl border border-line bg-surface p-6'
const LABEL = 'text-xs font-semibold uppercase tracking-wider text-gold-deep'
const LINK = 'mt-2 inline-block rounded text-body transition-colors hover:text-gold-deep'

export default function ContactPage() {
  return (
    <SiteShell path="/contact">
      <PageHeader heading={contact.heading} intro={contact.intro} imageSlot="contact-header" />

      <section className="border-b border-line py-16 sm:py-20 lg:py-14">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 sm:px-6">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* text-lg on the card, not on the link, so the licence under
                the number is the same size as the number. */}
            <li className={`${CARD} text-lg`}>
              <h2 className={LABEL}>{site.contact.phoneLabel}</h2>
              <a href={site.contact.phoneHref} className={`${LINK} font-semibold`}>
                {site.contact.phone}
              </a>
              <LicenseLine className="mt-1 block text-muted" />
            </li>
            <li className={CARD}>
              <h2 className={LABEL}>{site.contact.emailLabel}</h2>
              <a href={site.contact.emailHref} className={`${LINK} break-words`}>
                {site.contact.email}
              </a>
            </li>
            <li className={CARD}>
              <h2 className={LABEL}>{site.contact.hoursLabel}</h2>
              <p className="mt-2 text-body">{site.contact.hours}</p>
            </li>
            <li className={CARD}>
              <h2 className={LABEL}>{contact.licensedInLabel}</h2>
              <p className="mt-2 text-body">{site.contact.licensedIn}</p>
              <p className="mt-2 text-sm text-muted">{site.contact.otherStatesNote}</p>
            </li>
            <li className={`${CARD} sm:col-span-2`}>
              <h2 className={LABEL}>{contact.officeLabel}</h2>
              <address className="mt-2 not-italic text-body">{site.contact.address}</address>
            </li>
          </ul>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <CtaButton kind="quote">{site.hero.primaryCta}</CtaButton>
            <CtaButton kind="apply" variant="secondary">
              {site.agentOpportunity.cta}
            </CtaButton>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
