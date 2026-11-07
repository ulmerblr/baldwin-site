import type { Metadata } from 'next'
import { ImageSlot } from '@/components/image-slot'
import {
  BulletList,
  CtaBand,
  Disclaimer,
  PageHeader,
  TextBlock,
} from '@/components/page-sections'
import { ProductCard } from '@/components/sections'
import { SiteShell } from '@/components/site-shell'
import { carriers, productsIndex } from '@/content/pages'
import { productPage, products } from '@/content/products'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(productsIndex.meta)

/**
 * All six products on one page.
 *
 * They had a page each. The cards at the top are the same approved cards the
 * home page shows, and each one now jumps to that product's section further
 * down rather than to a separate route. Every section keeps its own copy
 * exactly as it was: the approved lead, How it works, Who it's for, What to
 * consider, and the shared state-variation disclaimer at the foot of the page.
 */
export default function ProductsPage() {
  return (
    <SiteShell path="/products">
      <PageHeader
        heading={productsIndex.heading}
        intro={productsIndex.intro}
        imageSlot="products-header"
      />

      {/* Contents. Same cards as the home page, same approved blurbs; each
          links down to its own section instead of out to a page. */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.services.items.map((service) => (
              <ProductCard
                key={service.title}
                title={service.title}
                description={service.description}
                // Directly under the h1 here, with no section heading between.
                headingLevel="h2"
              />
            ))}
          </ul>
        </div>
      </section>

      {products.map((product, index) => (
        <section
          key={product.slug}
          id={product.slug}
          // scroll-mt clears the sticky header when a card jumps down here.
          className={`scroll-mt-24 border-b border-line py-16 sm:py-20 ${
            index % 2 === 1 ? 'bg-surface' : ''
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl">
              {product.title}
            </h2>
            {/* The approved home page blurb, verbatim. */}
            <p className="measure mt-5 text-base leading-relaxed text-body sm:text-lg">
              {product.lead}
            </p>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-16">
              <div>
                <TextBlock
                  heading={productPage.howItWorksLabel}
                  paragraphs={[product.howItWorks]}
                />

                <div className="mt-12">
                  <h3 className="font-display text-2xl font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-3xl">
                    {productPage.whoItsForLabel}
                  </h3>
                  <BulletList items={product.whoItsFor} />
                </div>

                <TextBlock
                  heading={productPage.whatToConsiderLabel}
                  paragraphs={[product.whatToConsider]}
                  className="mt-12"
                />
              </div>

              <ImageSlot name={product.imageSlot} className="lg:sticky lg:top-24" />
            </div>
          </div>
        </section>
      ))}

      {/* Carriers. Text only -- see the note in content/pages.ts on why there
          are no logos here. Columns rather than one long strip so 31 names
          stay scannable; CSS columns keep the alphabetical order reading
          down each column. */}
      <section id="carriers" className="scroll-mt-24 border-b border-line bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl">
            {carriers.heading}
          </h2>
          <p className="measure mt-5 leading-relaxed text-body">{carriers.intro}</p>

          <ul className="mt-10 gap-x-10 text-body sm:columns-2 lg:columns-3">
            {carriers.names.map((name) => (
              <li
                key={name}
                className="mb-2.5 flex break-inside-avoid items-baseline gap-2.5 leading-snug"
              >
                <span aria-hidden="true" className="mt-px text-gold">
                  &#8226;
                </span>
                {name}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-muted">{carriers.footnote}</p>
        </div>
      </section>

      <CtaBand
        lead={productsIndex.ctaLead}
        primary={site.hero.primaryCta}
        callToAction={productsIndex.ctaCall}
      />
      {/* One disclaimer for the page now, rather than one per product page. */}
      <Disclaimer text={productPage.disclaimer} />
    </SiteShell>
  )
}
