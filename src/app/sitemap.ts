import type { MetadataRoute } from 'next'
import { nav } from '@/content/nav'
import { products } from '@/content/products'
import { canonicalUrl } from '@/lib/seo'

/**
 * Every public route. Built from the same nav and product lists the site
 * renders from, so a new page cannot be added without appearing here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const marketing = nav.map((item) => item.href)
  const productPages = products.map((product) => product.href)

  return [
    ...marketing.map((path) => ({
      url: canonicalUrl(path),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...productPages.map((path) => ({
      url: canonicalUrl(path),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: canonicalUrl('/privacy'), changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: canonicalUrl('/terms'), changeFrequency: 'yearly' as const, priority: 0.2 },
  ]
}
