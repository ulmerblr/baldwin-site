import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ImageSlot } from '@/components/image-slot'
import {
  BulletList,
  CtaBand,
  Disclaimer,
  PageHeader,
  TextBlock,
} from '@/components/page-sections'
import { SiteShell } from '@/components/site-shell'
import { productBySlug, productPage, products } from '@/content/products'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/seo'

/** All six pages are known at build time; nothing else resolves. */
export const dynamicParams = false

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = productBySlug.get(slug)
  if (!product) return {}
  return pageMetadata(product.meta)
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = productBySlug.get(slug)
  if (!product) notFound()

  return (
    <SiteShell path={product.href}>
      {/* The lead is the client's approved home page blurb, verbatim. */}
      <PageHeader heading={product.title} intro={product.lead} />

      <section className="border-b border-navy-800 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-16">
            <div>
              <TextBlock
                heading={productPage.howItWorksLabel}
                paragraphs={[product.howItWorks]}
              />

              <div className="mt-12">
                <h2 className="text-2xl font-bold tracking-tight text-ink-100 sm:text-3xl">
                  {productPage.whoItsForLabel}
                </h2>
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

      <CtaBand primary={site.hero.primaryCta} />
      <Disclaimer text={productPage.disclaimer} />
    </SiteShell>
  )
}
