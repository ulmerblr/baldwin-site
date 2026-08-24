import type { Metadata } from 'next'
import { ImageSlot } from '@/components/image-slot'
import { BulletList, CtaBand, PageHeader, TextBlock } from '@/components/page-sections'
import { SiteShell } from '@/components/site-shell'
import { agentOpportunityPage } from '@/content/pages'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(agentOpportunityPage.meta)

export default function AgentOpportunity() {
  return (
    <SiteShell path="/agent-opportunity">
      {/* Eyebrow, headline and subhead are the approved recruiting copy from
          the home page, reused verbatim. */}
      <PageHeader
        imageSlot="agent-header"
        eyebrow={site.agentOpportunity.eyebrow}
        heading={site.agentOpportunity.heading}
        intro={site.agentOpportunity.intro}
      />

      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.agentOpportunity.benefits.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-2xl border border-line bg-surface p-6"
              >
                <h2 className="text-base font-semibold text-ink">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body">{benefit.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-line bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-16">
            <div>
              <TextBlock
                heading={agentOpportunityPage.theWork.heading}
                paragraphs={[agentOpportunityPage.theWork.body]}
              />

              <TextBlock
                heading={agentOpportunityPage.whereYouCanBuild.heading}
                paragraphs={[agentOpportunityPage.whereYouCanBuild.body]}
                className="mt-12"
              />

              <div className="mt-12">
                <h2 className="font-display text-2xl font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-3xl">
                  {agentOpportunityPage.whoWereLookingFor.heading}
                </h2>
                <BulletList items={agentOpportunityPage.whoWereLookingFor.items} />
                <p className="mt-6 leading-relaxed text-body">
                  {agentOpportunityPage.whoWereLookingFor.closing}
                </p>
              </div>

              <TextBlock
                heading={agentOpportunityPage.howToApply.heading}
                paragraphs={[agentOpportunityPage.howToApply.body]}
                className="mt-12"
              />
            </div>

            <ImageSlot name="agent-team" className="lg:sticky lg:top-24" />
          </div>
        </div>
      </section>

      {/* Opens the existing application dialog. Still no resume upload. */}
      <CtaBand primary={site.agentOpportunity.cta} kind="apply" />
    </SiteShell>
  )
}
