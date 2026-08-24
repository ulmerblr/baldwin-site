import type { Metadata } from 'next'
import { CtaBand, PageHeader } from '@/components/page-sections'
import { ProductCard } from '@/components/sections'
import { SiteShell } from '@/components/site-shell'
import { productsIndex } from '@/content/pages'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(productsIndex.meta)

export default function ProductsPage() {
  return (
    <SiteShell path="/products">
      <PageHeader heading={productsIndex.heading} intro={productsIndex.intro} />

      <section className="border-b border-navy-800 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Same cards as the home page, same approved blurbs. */}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.services.items.map((service) => (
              <ProductCard
                key={service.title}
                title={service.title}
                description={service.description}
              />
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        lead={productsIndex.ctaLead}
        primary={site.hero.primaryCta}
        callToAction={productsIndex.ctaCall}
      />
    </SiteShell>
  )
}
