import type { Metadata } from 'next'
import Image from 'next/image'
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
 *
 * LAYOUT. Each section used to run its copy down a narrow left column with a
 * photograph parked in a sticky right column. The six per-product photographs
 * are gone, and the fix is not to let the paragraphs run the full width of the
 * page -- at 1280 that is about 140 characters a line, which is unreadable.
 * Instead the recovered width carries structure: the two prose blocks stay
 * together on the left at a measured width, and Who it's for moves beside them
 * as a card. That splits roughly equal amounts of copy into two balanced
 * columns, halves the height of every section, and keeps each column near 70
 * characters -- the `measure` cap holds the prose at 68ch however wide the
 * window gets, so the line length cannot drift on a large monitor.
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
            {/* The approved home page blurb, verbatim. `measure-lead` rather
                than `measure`: at 18px the latter sets about 92 characters a
                line, which is past the point where the eye reliably finds the
                next one. */}
            <p className="measure-lead mt-5 text-base leading-relaxed text-body sm:text-lg">
              {product.lead}
            </p>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
              {/* The prose. `measure` caps it at 68ch, so the column can be
                  as wide as the grid gives it without the lines getting
                  longer than they should. */}
              <div className="measure">
                <TextBlock
                  heading={productPage.howItWorksLabel}
                  paragraphs={[product.howItWorks]}
                />
                <TextBlock
                  heading={productPage.whatToConsiderLabel}
                  paragraphs={[product.whatToConsider]}
                  className="mt-10"
                />
              </div>

              {/* The list, in the same card treatment the rest of the site
                  uses, so the right half of the section carries weight
                  instead of standing empty where the photograph was. On the
                  alternating bands it takes the opposite ground to the
                  section it sits in, so the card reads as a card either way. */}
              <div
                className={`rounded-2xl border border-line p-6 sm:p-8 ${
                  index % 2 === 1 ? 'bg-paper' : 'bg-surface'
                }`}
              >
                <h3 className="font-display text-2xl font-semibold leading-[1.15] tracking-[-0.015em] text-ink">
                  {productPage.whoItsForLabel}
                </h3>
                <BulletList items={product.whoItsFor} />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Carriers. Columns rather than one long strip so 31 names stay
          scannable; CSS columns keep the alphabetical order reading down each
          column. The client-supplied logo directory follows the names rather
          than leading them -- see the note on the figure below. */}
      <section id="carriers" className="scroll-mt-24 border-b border-line bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.015em] text-ink sm:text-4xl">
            {carriers.heading}
          </h2>
          <p className="measure-body mt-5 leading-relaxed text-body">{carriers.intro}</p>

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

          {/*
            The carrier logo directory, supplied by the client.

            AFTER the names, not before them. The list is the usable version
            of this information -- it is live text, so it is searchable, it is
            read correctly by a screen reader, and it reflows to one column on
            a phone. The sheet is a dense four-column graphic: at 1104px it is
            essentially 1:1 and every caption reads, but on a 360px screen the
            same captions land near 2px and nothing can be done about that. So
            the readable thing goes first and the picture closes the section.

            No heading of ours above it: the sheet carries its own title and
            its own attribution line, and a second heading would compete with
            the one printed inside it.

            Short alt rather than a recital of the names -- they are already
            live text directly above, and repeating all 31 would make a screen
            reader read the list twice.
          */}
          <figure className="mt-12">
            <Image
              src="/images/carrier-logo-directory.webp"
              alt="Logo directory of the 31 carriers named above."
              width={1193}
              height={923}
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="h-auto w-full rounded-2xl border border-line"
            />
          </figure>

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
